export interface DraftPrRequest {
  owner: string;
  repo: string;
  branch: string;
  title: string;
  body: string;
}

export interface PublishResult {
  mode: 'dry-run' | 'live';
  url: string;
  message: string;
}

export async function createOrUpdateDraftPr(req: DraftPrRequest): Promise<PublishResult> {
  if (process.env.GITHUB_DRY_RUN !== 'false') {
    return {
      mode: 'dry-run',
      url: `https://github.com/${req.owner}/${req.repo}/pull/dry-run`,
      message: `Dry-run draft PR for ${req.branch}`
    };
  }

  return {
    mode: 'live',
    url: `https://github.com/${req.owner}/${req.repo}/pull/1`,
    message: 'Live publish path must be wired with Octokit credentials'
  };
}
