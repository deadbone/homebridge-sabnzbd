# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Reworked README documentation using the structure of the companion Homebridge plugin documentation.
- Added GitHub Wiki-ready documentation pages for installation, configuration, HomeKit mapping, API usage, troubleshooting, security, development, FAQ and contribution.
- Tightened the Homebridge UI schema with strict validation and password masking for the SABnzbd API key.
- Refined the plugin icon, banner and OpenGraph image with a yellow, orange, black and white palette inspired by SABnzbd.
- Updated README banner references to force GitHub to load the refreshed artwork.

## [0.1.0] - 2026-07-18

### Added

- Initial Homebridge dynamic platform plugin for SABnzbd.
- SABnzbd HTTP JSON API client with queue, history and status polling.
- HomeKit services for pause/resume, temporary pause, speed limit, manual refresh and optional warning clearing.
- Monitoring sensors for downloading, queue state, warnings, last failed download and numeric status values.
- Homebridge Config UI X schema.
- English and French README files.
- Initial wiki pages and branding asset placeholders.
- Unit tests for configuration and API snapshot mapping.
