Suivre la spécification [Commits Conventionnels](https://www.conventionalcommits.org/fr/v1.0.0/) pour le nommage des branches/commits/merge requests.

## Nommage branche/commit/mr

```
<type>[étendue optionnelle]: <description>

type = feat:, fix:, build:, chore:, ci:, docs:, style:, localize:, refactor:, perf:, test:
```

Exemple :

```
feat(parser): add the ability to parse arrays
```

## Merge requests

Référencer les Issues liées dans la description de la merge request,
exemple avec la [MR 3](https://gricad-gitlab.univ-grenoble-alpes.fr/piconf/evently/-/merge_requests/3) :

```markdown
Ferme [#9](https://gricad-gitlab.univ-grenoble-alpes.fr/piconf/evently/-/issues/9).
```

Ca permet à GitLab de détecter les liens entre les Issues et merge requests :
- Boite "Development" dans la carte de l'issue qui affiche la MR corrigeant l'issue.
- Phrase "Mentions issue #9" dans les détails de la MR.
