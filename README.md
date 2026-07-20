# `tree-sitter-openacc`

OpenACC grammar for tree-sitter.
Experimental and written by someone who doesn't know a lot about tree-sitter, yet.

Written for providing syntax highlighting in OpenACC directives.
Currently only support for Fortran is provided.

## Installation (Neovim)

Installation requires building the parser, installing the parser and the highlighting,
and installing the Fortran injection.
The later extends global injections such as the one from [`nvim-treesitter`][nvim-treesitter].

### Manual

```bash
tree-sitter build
mkdir -p ~/.config/nvim/parser ~/.config/nvim/queries/after/{openacc,fortran}
cp ./openacc.so ~/.config/nvim/parser
cp ./queries/highlights.scm ~/.config/nvim/queries/after/openacc
cp ./fortran-injections.scm ~/.config/nvim/queries/after/fortran
```

### [`nvim-treesitter`][nvim-treesitter]

```lua
vim.api.nvim_create_autocmd("User", {
  pattern = "TSUpdate",
  callback = function()
    ---@diagnostic disable-next-line: missing-fields
    require("nvim-treesitter.parsers").openacc = {
      install_info = {
        url = "https://github.com/loicreynier/tree-sitter-openacc",
        revision = "b17931de5e809e7b1fd094876fd96a73d0d045b6",
        queries = "queries",
      },
    }
  end,
})
```

```bash
curl -L -o ~/.config/nvim/after/queries/fortran/injections.scm https://raw.githubusercontent.com/loicreynier/tree-sitter-openacc/refs/heads/main/fortran-injections.scm
```

[nvim-treesitter]: https://github.com/nvim-treesitter/nvim-treesitter
