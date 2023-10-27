## Git Commit Message Convention

Please ensure that all commits in this repository adhere to the following convention:

#### TL;DR

Commit messages must match the following regular expression:

```js
/^(add|remove|edit|fix|docs): .{1,72}/
```

#### Examples

```
add: /ping command
```

```
remove: discord.js pnpm dependency
```

```
edit: vscode snippets
```

```
fix: handle events correctly
```

```
docs: new api endpoint info
```

Should you wish to reference an issue, you can include a hashtag followed by the issue number in the message body, like this:

```
add: /ping command

suggested in issue #12
```

```
fix: handle events correctly

reported in issue #12
```

If you intend to close an issue, you can use either "fixes" followed by a hashtag and issue number for a bug fix, or simply "closes" followed by a hashtag and issue number within the message footer, like this:

```
add: /ping command

suggested in issue #12

closes #12
```

```
fix: handle events correctly

reported in issue #12

fixes #12
```

### Full Message Format

A commit message consists of a **header**, **body**, and **footer**. The header includes a **type** and **subject**:

```
<type>: <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is obligatory, while all other parts are optional.

### Subject

The subject contains a succinct description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize the first letter
- no dot (.) at the end

### Body

Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

### Footer

The footer is the place to reference GitHub issues that this commit **closes** or **fixes**.