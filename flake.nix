{
  description = "agnabot discord bot";

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
    };

    packages.${system}.default = pkgs.buildNpmPackage {
      pname = "agnabot";
      version = "git";

      src = self;

      npmDepsHash = "sha256-qTaCqBYDcFspNhtrm4hLDlfCg6808W9WNyFt/ejZnhY=";
      dontNpmBuild = true;

      nativeBuildInputs = with pkgs; [
        python3
        gnumake
        pkg-config
      ];

      buildInputs = with pkgs; [
        sqlite
      ];

      propagatedBuildInputs = with pkgs; [
        nodejs_24
        sqlite
      ];

      installPhase = ''
        runHook preInstall

        mkdir -p $out/app
        cp -r . $out/app

        mkdir -p $out/bin
        makeWrapper ${pkgs.nodejs_24}/bin/node \
          $out/bin/agnabot \
          --add-flags "$out/app/index.js"

        runHook postInstall
      '';
    };
  };
}
