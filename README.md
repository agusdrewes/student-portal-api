# student-portal-api

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Description

BFF (Backend for Frontend) for the student portal with their academic record, upcoming events, purchases and the academic calendar

## Prerequisites

This project requires Node.js v22.17.1. We recommend using nvm (Node Version Manager) to manage your Node.js versions.

### Install nvm (Node Version Manager)

**For macOS/Linux:**

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload your shell configuration
source ~/.bashrc
# or for zsh users:
source ~/.zshrc
```

**For Windows:**

- Download and install nvm-windows from: https://github.com/coreybutler/nvm-windows/releases

### Configure Node.js version

After installing nvm, use the provided `.nvmrc` file to install and use the correct Node.js version:

```bash
# Install the Node.js version specified in .nvmrc
nvm install

# Use the Node.js version specified in .nvmrc
nvm use

# Verify the installation
node --version  # Should output v22.17.1
npm --version   # Should output 10.9.2 or higher
```

## VS Code Setup

To ensure consistent code formatting and linting, install and configure the following VS Code extensions:

### Required Extensions

1. **ESLint** - `ms-vscode.vscode-eslint`
2. **Prettier - Code formatter** - `esbenp.prettier-vscode`

### Installation Methods

Install via VS Code Extensions Marketplace\*\*

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for "ESLint" and install the Microsoft ESLint extension
4. Search for "Prettier" and install the Prettier - Code formatter extension

### VS Code Configuration (Optional)

Create your personal `.vscode/settings.json` file for optimal development experience:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.formatOnPaste": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.validate": ["javascript", "typescript"],
  "prettier.requireConfig": true,
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

**Note:** The `.vscode/settings.json` file is gitignored to allow personal preferences. The above configuration is recommended but not enforced.

### Workspace Extensions (Automatic)

The project includes `.vscode/extensions.json` which automatically suggests these extensions to team members when they open the project.

### Verification

After installation, you should see:

- ✅ ESLint errors/warnings highlighted in your TypeScript files
- ✅ Code automatically formatted on save according to Prettier rules
- ✅ Auto-fix available for ESLint issues (Ctrl+Shift+P → "ESLint: Fix all auto-fixable Problems")

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

....

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
