FULL_NAME="34j"
GITHUB_USER="34j"
REPO_NAME="vscode-python-extension-core"
sed -i.mybak "s/ryansonshine/$GITHUB_USER/g; s/typescript-npm-package-template\|my-package-name/$REPO_NAME/g; s/Ryan Sonshine/$FULL_NAME/g" package.json package-lock.json README.md
rm *.mybak