{
  description = "agnabot flake";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs, ... }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs { inherit system; };
      nodePackages = import ./node-packages.nix {
        inherit pkgs;
        fetchurl = pkgs.fetchurl;
        fetchgit = pkgs.fetchgit;
        stdenv = pkgs.stdenv;
        lib = pkgs.lib;
        nix-gitignore = pkgs.nix-gitignore;
      };
    in {
      packages.${system}.agnabot = nodePackages.agnabot;
    };
}
