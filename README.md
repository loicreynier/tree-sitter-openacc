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

[nvim-treesitter]: https://github.com/nvim-treesitter/nvim-treesitter
