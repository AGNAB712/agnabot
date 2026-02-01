{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
  };

  outputs = {
    self,
    nixpkgs,
  }: let
    pkgs = nixpkgs.legacyPackages."x86_64-linux";
  in {
    packages."x86_64-linux".default = pkgs.buildNpmPackage {
      pname = "agnabot";
      version = "1.0.0";
      src = ./.;
      npmDepsHash = "sha256-qTaCqBYDcFspNhtrm4hLDlfCg6808W9WNyFt/ejZnhY=";
    };
  };
}