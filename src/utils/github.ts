export interface ActivityDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ContributionData {
  totalContributions: number;
  days: ActivityDay[];
}

export async function getGitHubContributions(username: string): Promise<ContributionData | null> {
  const token = process.env.GITHUB_TOKEN;

  if (token) {
    try {
      const query = `
        query($username: String!) {
          user(login: $username) {
            contributionsCollection {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    contributionCount
                    date
                    contributionLevel
                  }
                }
              }
            }
          }
        }
      `;

      const res = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Portfolio-App',
        },
        body: JSON.stringify({ query, variables: { username } }),
        next: { revalidate: 60 }, // Cache for 1 minute so new commits appear quickly
      });

      if (!res.ok) {
        console.error('GitHub GraphQL fetch failed:', await res.text());
        return null;
      }

      const json = await res.json();
      const calendar = json?.data?.user?.contributionsCollection?.contributionCalendar;

      if (!calendar) return null;

      const levelMap: Record<string, 0 | 1 | 2 | 3 | 4> = {
        NONE: 0,
        FIRST_QUARTILE: 1,
        SECOND_QUARTILE: 2,
        THIRD_QUARTILE: 3,
        FOURTH_QUARTILE: 4,
      };

      const days: ActivityDay[] = [];
      for (const week of calendar.weeks) {
        for (const day of week.contributionDays) {
          days.push({
            date: day.date,
            count: day.contributionCount,
            level: levelMap[day.contributionLevel] ?? 0,
          });
        }
      }

      return {
        totalContributions: calendar.totalContributions,
        days,
      };
    } catch (err) {
      console.error('Error in getGitHubContributions:', err);
      return null;
    }
  }

  return null;
}
