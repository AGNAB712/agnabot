{
  description = "agnabot nix flake";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs = { self, nixpkgs }: let
    system = "x86_64-linux";
    pkgs = import nixpkgs { inherit system; };
    nodeDeps = import ./node-packages.nix { inherit pkgs; };
  in {
    packages.${system}.default = pkgs.stdenv.mkDerivation {
      pname = "agnabot";
      version = "1.0.0";

      src = ./.;

      nativeBuildInputs = [ pkgs.nodejs pkgs.yarn ];

      buildInputs = [ nodeDeps.nodePackages ];

      # we don’t need to compile anything manually
      installPhase = ''
        mkdir -p $out/bin
        cp -r ./* $out/
      '';
    };
  };
}
