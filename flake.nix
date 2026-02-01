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
      npmDepsHash = "sha256-69POC5/vwmhTfv8wygJS2goOG2VEeEl1xMAuv9EiqbQ=";
    };
  };
}