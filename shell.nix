let
  pkgs = import (builtins.fetchGit {
    name = "nixpkgs-18.09";
    url = "git@github.com:nixos/nixpkgs.git";
    rev = "6a3f5bcb061e1822f50e299f5616a0731636e4e7";
    ref = "refs/tags/18.09";
  }){};
in
with pkgs;
with nodePackages;
mkShell {
  buildInputs = [nodejs-8_x typescript];
}
