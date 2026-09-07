#!/usr/bin/env bash
# Sync issue labels in a GitHub repository using the gh CLI.
# Existing labels are updated in place; missing ones are created;
# labels not listed below are deleted.
# Edit the LABELS array below, then run: ./ReplaceLabels.sh
set -euo pipefail

REPOSITORY="oliverperzyk/bedrock-discord"

# Flat triplets: name, color, description (repeat).
# Color is a 6-digit hex (with or without '#'). Description may be "".
LABELS=(
	# Name of a label, color (6-digit hex with or without '#'), description.

    # Labels related to dependencies.
    "deps" "000000" "General tag for updating dependencies."
    "deps/bun" "ddeedd" "Tag for updating Bun's dependencies."
    "deps/docker" "ddddee" "Tag for updating Dockerfile images."
    "deps/docker-compose" "ffddff" "Tag for updating Docker Compose images."
    "deps/actions" "ddffdd" "Tag for updating GitHub Actions workflows."

    # Labels related to issues.
    "bug" "ff5555" "Something isn't working, not optimized enough, etc."
    "enhancement" "5555ff" "New feature or request to the codebase or the application itself."
    "documentation" "55ff55" "Improvements or additions to documentation."
    "question" "ddcc55" "Further information is requested."
)

if (( ${#LABELS[@]} % 3 != 0 )); then
	echo "error: LABELS must be name/color/description triplets (got ${#LABELS[@]} values)" >&2
	exit 1
fi

if ! command -v gh >/dev/null 2>&1; then
	echo "error: gh CLI is required (https://cli.github.com/)" >&2
	exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
	echo "error: not authenticated — run: gh auth login" >&2
	exit 1
fi

array_contains() {
	local needle="$1"
	shift
	local item
	for item in "$@"; do
		[[ "${item}" == "${needle}" ]] && return 0
	done
	return 1
}

existing_names=()
while IFS= read -r name; do
	[[ -z "${name}" ]] && continue
	existing_names+=("${name}")
done < <(gh label list --repo "${REPOSITORY}" --limit 1000 --json name --jq '.[].name')

desired_names=()
for ((i = 0; i < ${#LABELS[@]}; i += 3)); do
	desired_names+=("${LABELS[i]}")
done

echo "Syncing labels in ${REPOSITORY}..."
for ((i = 0; i < ${#LABELS[@]}; i += 3)); do
	name="${LABELS[i]}"
	color="${LABELS[i + 1]#\#}"
	description="${LABELS[i + 2]}"

	if [[ -z "${name}" || -z "${color}" ]]; then
		echo "error: invalid label at index ${i}: name='${name}' color='${color}'" >&2
		exit 1
	fi

	if array_contains "${name}" "${existing_names[@]+"${existing_names[@]}"}"; then
		echo "  ~ ${name} (#${color})"
		args=(label edit "${name}" --repo "${REPOSITORY}" --color "${color}")
	else
		echo "  + ${name} (#${color})"
		args=(label create "${name}" --repo "${REPOSITORY}" --color "${color}")
	fi

	args+=(--description "${description}")
	gh "${args[@]}"
done

deleted_any=0
for name in "${existing_names[@]+"${existing_names[@]}"}"; do
	if array_contains "${name}" "${desired_names[@]}"; then
		continue
	fi
	if (( deleted_any == 0 )); then
		echo "Deleting labels not in the desired set..."
		deleted_any=1
	fi
	echo "  - ${name}"
	gh label delete "${name}" --repo "${REPOSITORY}" --yes
done

echo "Done. Current labels:"
gh label list --repo "${REPOSITORY}" --limit 1000
