# WAFFLE 101
## Start tracking issues

1.  The first step in allowing Waffle to automatically track your work is to create a branch that contains the **issue number**:

    <div class="highlighter-rouge">

        $ git checkout -b topic-#42
        Switched to a new branch 'topic-#42'

    </div>

2.  And push it to your remote:

    <div class="highlighter-rouge">

        $ git push --set-upstream origin topic-#42
        Total 0 (delta 0), reused 0 (delta 0)
        * [new branch]   topic-#42 -> ropic-#42

    </div>

3.  When the branch is pushed remotely, Waffle automatically moves the card to **_“In Progress”_** and assigns you as an owner. ![](https://s3.amazonaws.com/uploads.intercomcdn.com/i/o/14743105/80cb5c2da891210ff7727e2f/kelli-moved-42.png)

## Closing an issue in the same repository

To close an issue in the same repository, we’ll use Github’s [keywords for closing issues](https://help.github.com/articles/closing-issues-via-commit-messages/ "Github's keywords for closing issues")

## Connecting your PR to issues

Sometimes you may want to connect a PR and an existing GitHub Issue together, but don’t necessarily want merging that PR to your default branch to close the referenced issue. In this case, you can use Waffle’s “Connect” keywords.

Waffle will connect your PR Issue to a referenced GitHub Issue that has the following keywords in front of the issue reference:

*   connect to
*   connects to
*   connected to
*   connect
*   connects
*   connected

Instead of the PR Issue appearing as a separate card on your board, the PR Issue will be nested beneath, or “connected to” the referenced GitHub Issue.

## Keyboard Shortcuts

Finally, some shortcuts to make your life easier while using Waffle’s panel:

*   **/ or f** : Filter Cards
*   **i** : New Issue
*   **r** : Reload Columns
*   **⌘ + \** : Toggle Sidebar
*   **?** : See Shortcut Documentation
