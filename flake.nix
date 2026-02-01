{
  description = "agnabot flake";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs, ... }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs { inherit system; };
      # import the node2nix-generated packages
      nodePackages = import ./node-packages.nix { inherit pkgs; };
    in {
      # deployable package
      packages.${system} = {
        agnabot = nodePackages.agnabot;
      };

      # defaultPackage points to the deployable package
      defaultPackage.${system} = self.packages.${system}.agnabot;

      # development shell
      devShells.${system}.default = pkgs.mkShell {
        buildInputs = [
          pkgs.nodejs
          nodePackages.agnabot
        ];

        shellHook = ''
          export NODE_PATH=${nodePackages.agnabot}/lib/node_modules
        '';
      };
    };
}
