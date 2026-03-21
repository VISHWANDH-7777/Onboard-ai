from __future__ import annotations

from pathlib import Path

import pandas as pd

from dataset_builder import build_custom_dataset


def main() -> None:
  dataset, skill_map, relationships = build_custom_dataset()

  out_dir = Path(__file__).resolve().parent / 'data'
  out_dir.mkdir(parents=True, exist_ok=True)

  roles_df = dataset.copy()
  roles_df['skills_required'] = roles_df['skills_required'].apply(lambda x: '|'.join(x))
  roles_df['skill_level'] = roles_df['skill_level'].apply(lambda x: '|'.join(x))
  roles_path = out_dir / 'nebula_roles_dataset.csv'
  roles_df.to_csv(roles_path, index=False)

  skills_df = pd.DataFrame({'skill': skill_map['skills']})
  skills_path = out_dir / 'nebula_skill_catalog.csv'
  skills_df.to_csv(skills_path, index=False)

  rel_df = pd.DataFrame(relationships, columns=['source_skill', 'target_skill'])
  rel_path = out_dir / 'nebula_skill_relationships.csv'
  rel_df.to_csv(rel_path, index=False)

  print(f'Exported: {roles_path}')
  print(f'Exported: {skills_path}')
  print(f'Exported: {rel_path}')


if __name__ == '__main__':
  main()
