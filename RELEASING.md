# Releasing

There are two ways a change reaches readers, and only one of them needs a release:

| Target | How it updates | Your action |
|---|---|---|
| Web app and PWA (`/app/` on GitHub Pages) | Every merge to `main` deploys it (`.github/workflows/pages.yml`). Installed PWAs show "Jest nowa wersja aplikacji" and reload on click. | None. |
| Desktop app (Windows, macOS) | Only through a GitHub Release built from a `v*` tag. There is no auto-update: people download the new build from the Pages root. | Follow the checklist below. |

So the desktop app lags behind the web app until you cut a release. Release when a batch of content or features is worth a download, not after every merge.

## Choosing the version

Semantic versioning, `MAJOR.MINOR.PATCH`:

- **PATCH** (`0.1.0` -> `0.1.1`): fixes and corrections in existing content, no new features.
- **MINOR** (`0.1.1` -> `0.2.0`): new topics, questions, categories or app features.
- **MAJOR** (`0.x` -> `1.0.0`): a change that breaks saved progress without a migration, or the first "finished" version.

## Checklist

### 1. Bump the version (pull request)

```bash
git checkout main && git pull
git checkout -b chore/release-0.2.0
```

Set the **same** version in both files:

- `package.json`: `"version": "0.2.0"`
- `tinyjs.json`: `"version": "0.2.0"`

```bash
git commit -am "Release 0.2.0"
git push -u origin chore/release-0.2.0
gh pr create --base main --title "Release 0.2.0" --body "Version bump for the 0.2.0 desktop release."
```

Wait for green CI (the `desktop` job also builds both apps), then merge.

### 2. Tag the merged commit

```bash
git checkout main && git pull
git tag v0.2.0
git push origin v0.2.0
```

The tag must point to the commit on `main` that has the bumped versions. The workflow stops with an error if the tag and either file disagree.

### 3. Watch the release build

```bash
gh run watch $(gh run list --workflow Release --limit 1 --json databaseId --jq '.[0].databaseId')
```

Or open the "Release" workflow on the Actions tab. It builds the Windows zip and the universal macOS dmg (about 2 minutes), then creates the release with notes generated from the merged pull requests.

### 4. Check the result

- [ ] https://github.com/pawelpukszta/frontend-knowledge/releases/latest shows the new version with `baza-wiedzy-fe-windows-x64.zip` and `baza-wiedzy-fe-macos.dmg`.
- [ ] "Pobierz na Windows" on https://pawelpukszta.github.io/frontend-knowledge/ downloads the new zip.
- [ ] On Windows: unpack over the old folder (or into a new one), start `baza-wiedzy-fe.exe`, and check that your progress is still there and the new content shows up.
- [ ] Optional: edit the release notes on GitHub (what changed for readers, in a few lines).

## When something goes wrong

**Version mismatch** (the "Check that the tag matches" step fails): delete the tag, fix the versions through a pull request, then tag again.

```bash
git push --delete origin v0.2.0
git tag -d v0.2.0
```

**A build job fails** (tinyjs or runner problem): use "Re-run failed jobs" on the run. If the code itself is broken, fix it on `main`, then delete the tag (as above) and tag the fixed commit.

**A bad release is already published**: delete it with its tag, then release again.

```bash
gh release delete v0.2.0 --cleanup-tag --yes
git tag -d v0.2.0
```

## Never change

- **`id` in `tinyjs.json`** (`io.github.pawelpukszta.frontend-knowledge`). The desktop app keeps progress in a folder named after it (`%APPDATA%\io.github.pawelpukszta.frontend-knowledge\store.json` on Windows), so a new id starts everyone with empty progress.
- **The release file names** (`baza-wiedzy-fe-windows-x64.zip`, `baza-wiedzy-fe-macos.dmg`). The download buttons on the Pages root link to `releases/latest/download/<file name>`.
- **Topic and question ids** in `content/` (see README): progress is stored against them in both the web and desktop app.

## Updating tinyjs

The tinyjs version is pinned in `.github/actions/setup-tinyjs/action.yml` (`version` input). To move to a newer one, change it there and `minTinyjsVersion` in `tinyjs.json` in one pull request, check that the `desktop` CI job passes, then release as usual. The tinyjs changelog is at https://tinyjs.app/changelog.
