# `tree-sitter-openacc`

OpenACC grammar for tree-sitter.
Experimental and written by someone who doesn't know a lot about tree-sitter, yet.

Written for providing syntax highlighting in OpenACC directives.
Currently only support for Fortran is provided.

## Installation (Neovim)

```bash
tree-sitter build
mkdir -p ~/.config/nvim/parser ~/.config/nvim/queries/{openacc,fortran}
cp ./openacc.so ~/.config/nvim/parser
cp ./queries/highlights.scm ~/.config/nvim/queries/openacc
cp ./queries/injections.scm ~/.config/nvim/queries/fortran
```

The injection may conflict with other Fortran injections,
for example the one from [`nvim-treesitter`][nvim-treesitter]
(their global injections are included here).

Injection files can be listed with:

```lua
print(vim.inspect(vim.treesitter.query.get_files("fortran", "injections")))
```

Otherwise, the parser and injections can be automatically installed
with my fork of [`nvim-treesitter`][nvim-treesitter]: <https://github.com/loicreynier/nvim-treesitter>

[nvim-treesitter]: https://github.com/nvim-treesitter/nvim-treesitter
