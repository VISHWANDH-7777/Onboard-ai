from __future__ import annotations

import ast
import math
import re
from dataclasses import dataclass
from typing import Dict, List, Sequence

import nltk
import numpy as np
import pandas as pd
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import word_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.multiclass import OneVsRestClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import MultiLabelBinarizer

from dataset_builder import build_custom_dataset


for resource in ['punkt', 'punkt_tab', 'wordnet', 'omw-1.4', 'stopwords']:
  try:
    nltk.data.find(resource)
  except LookupError:
    nltk.download(resource, quiet=True)


@dataclass
class AnalyzeOutput:
  matchScore: float
  resumeSkills: List[str]
  requiredSkills: List[str]
  matchedSkills: List[str]
  missingSkills: List[str]
  weakSkills: List[str]
  reasoning: List[str]
  learningPath: List[Dict]
  careerPath: Dict


class NebulaAdaptiveModel:
  def __init__(self) -> None:
    self.dataset, self.skill_map, self.relationships = build_custom_dataset()
    self.skill_catalog = self.skill_map['skills']

    self.stop_words = set(stopwords.words('english'))
    self.lemmatizer = WordNetLemmatizer()
    self.skill_lookup = {self._normalize_text(skill): skill for skill in self.skill_catalog}

    self.mlb = MultiLabelBinarizer()
    y = self.mlb.fit_transform(self.dataset['skills_required'])

    role_texts = self.dataset.apply(
      lambda row: f"{row['role']} {row['category']} {' '.join(row['skills_required'])}",
      axis=1,
    )

    self.pipeline: Pipeline = Pipeline(
      steps=[
        ('tfidf', TfidfVectorizer(ngram_range=(1, 2), min_df=1)),
        (
          'clf',
          OneVsRestClassifier(
            LogisticRegression(max_iter=200),
          ),
        ),
      ],
    )
    self.pipeline.fit(role_texts, y)

    self.role_to_category = {
      row['role']: row['category'] for _, row in self.dataset.iterrows()
    }

  def _normalize_text(self, text: str) -> str:
    tokens = word_tokenize(re.sub(r'[^a-zA-Z0-9\s]', ' ', text.lower()))
    filtered = [
      self.lemmatizer.lemmatize(tok)
      for tok in tokens
      if tok not in self.stop_words and tok.strip()
    ]
    return ' '.join(filtered)

  def _extract_skills_rule_based(self, text: str) -> List[str]:
    normalized_text = self._normalize_text(text)
    extracted = []

    for skill in self.skill_catalog:
      norm_skill = self._normalize_text(skill)
      if norm_skill and norm_skill in normalized_text:
        extracted.append(skill)

    return sorted(set(extracted))

  def _predict_related_skills(self, text: str, threshold: float = 0.22) -> List[str]:
    proba = self.pipeline.predict_proba([text])[0]
    indices = np.where(proba >= threshold)[0]
    skills = []
    for idx in indices:
      if idx < len(self.mlb.classes_):
        skills.append(self.mlb.classes_[idx])
    return sorted(set(skills))

  def extract_resume_skills(self, resume_text: str) -> List[str]:
    rule_based = self._extract_skills_rule_based(resume_text)
    predicted = self._predict_related_skills(resume_text)
    return sorted(set(rule_based + predicted))

  def parse_jd(self, job_description: str) -> List[str]:
    rule_based = self._extract_skills_rule_based(job_description)
    predicted = self._predict_related_skills(job_description)
    return sorted(set(rule_based + predicted))

  def _build_learning_path(self, missing_skills: Sequence[str]) -> List[Dict]:
    modules = []
    for skill in missing_skills:
      modules.append(
        {
          'skill': skill,
          'steps': [
            f'{skill} Basics',
            f'{skill} Guided Projects',
            f'{skill} Production Implementation',
          ],
          'duration': '8h' if len(skill) % 2 == 0 else '6h',
        },
      )
    return modules

  def _infer_roles(self, target_role: str) -> Dict:
    if target_role and target_role.strip():
      current_role = 'Current Contributor'
      target = target_role.strip()
    else:
      target = 'Full Stack Developer'
      current_role = 'Junior Developer'

    timeline = [
      f'{current_role} -> Mid-Level Engineer',
      'Mid-Level Engineer -> Senior Engineer',
      f'Senior Engineer -> {target}',
      f'{target} -> Architect',
    ]

    return {
      'currentRole': current_role,
      'targetRole': target,
      'timeline': timeline,
    }

  def analyze(
    self,
    resume_text: str,
    job_description: str,
    target_role: str = '',
    experience_level: str = 'Intermediate',
  ) -> AnalyzeOutput:
    resume_skills = self.extract_resume_skills(resume_text)
    required_skills = self.parse_jd(job_description)

    if not required_skills:
      required_skills = ['System Design', 'REST API', 'Testing']

    matched = sorted(set(resume_skills).intersection(required_skills))
    missing = sorted(set(required_skills) - set(resume_skills))

    total_required = max(len(required_skills), 1)
    match_score = (len(matched) / total_required) * 100.0
    match_score = round(match_score, 2)

    weak_skills = missing[: max(1, min(3, len(missing)))]
    reasoning = [
      f"Matched {len(matched)} out of {len(required_skills)} required skills.",
      f"Experience level considered: {experience_level}.",
    ]

    for skill in weak_skills:
      reasoning.append(f'{skill} missing -> added to learning path')

    learning_path = self._build_learning_path(missing)
    career_path = self._infer_roles(target_role)

    return AnalyzeOutput(
      matchScore=match_score,
      resumeSkills=resume_skills,
      requiredSkills=required_skills,
      matchedSkills=matched,
      missingSkills=missing,
      weakSkills=weak_skills,
      reasoning=reasoning,
      learningPath=learning_path,
      careerPath=career_path,
    )


def build_dataset_preview() -> Dict[str, int]:
  dataset, skill_map, relationships = build_custom_dataset()
  rows = len(dataset)
  role_count = int(dataset['role'].nunique())
  skill_count = len(skill_map['skills'])
  mapped_skills = int(dataset['skills_required'].apply(len).sum())
  relation_count = len(relationships)

  return {
    'dataset_rows': rows,
    'role_count': role_count,
    'skill_catalog_count': skill_count,
    'mapped_skills_count': mapped_skills,
    'skill_relationships_count': relation_count,
  }
