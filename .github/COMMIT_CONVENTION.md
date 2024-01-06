## Git Commit Message Convention

Please ensure that all commits in this repository adhere to the following convention:

#### TL;DR

Commit messages must match the following regular expression:

```js
/^(create|remove|modify|fix)(\((bot|site|docs|dash|api|schemas|tsconfig)\))?: .{1,72}/
```

#### Examples

```
create(bot): `/foo` command
```

```
remove(schemas): `foo()` function
```

```
modify(dash): move `/modules/foo` to `/modules/bar`
```

```
fix(docs): correct spelling errors
```

Should you wish to reference an issue, you can include a hashtag followed by the issue number in the message body, like this:

```
create(bot): `/foo` command

suggested in issue #69
```

```
fix(api): patch exploit on `/api/foo` endpoint  

reported in issue #420
```

Should you wish to close an issue, you can use either "fixes" followed by a hashtag and issue number for a bug fix, or simply "closes" followed by a hashtag and issue number within the message footer, like this:

```
create(bot): `/foo` command

suggested in issue #69

closes #96
```

```
fix(api): patch exploit on `/api/foo` endpoint  

reported in issue #420

fixes #420
```

### Full Message Format

A commit message consists of a **header**, **body**, and **footer**. The header includes a **type** and **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is obligatory, while all other parts are optional.

### Subject

The **subject** contains a succinct description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize the first letter
- no dot (.) at the end

### Scope

The **scope** is used to specify the place of the commit change.
If the commit change is a non-app file or directory (i.e. `README.md` or `.github`), the scope is not required.

### Body

Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The **body** should include the motivation for the change and contrast this with previous behavior.

### Footer

The **footer** is the place to reference GitHub issues that this commit **closes** or **fixes**.