{
  description = "agnabot dev environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }:
  let
    system = "x86_64-linux";
    pkgs = import nixpkgs { inherit system; };
  in {
    devShells.${system}.default = pkgs.mkShell {
      packages = with pkgs; [
        nodejs_24
        nodePackages.npm
        python3
        gnumake
        gcc
        pkg-config
        sqlite
      ];

      shellHook = ''
        echo "node dev shell loaded"
        node -v
      '';
    };
  };
}
