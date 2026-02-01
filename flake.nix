{
  description = "agnabot flake";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs, ... }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs { inherit system; };
      nodePackages = import ./node-packages.nix { inherit pkgs; };
    in {
      packages.${system} = {
        agnabot = nodePackages.agnabot;
      };
      # this exposes it directly as self.packages.${system}.agnabot
      defaultPackage.${system} = nodePackages.agnabot;
    };
}
