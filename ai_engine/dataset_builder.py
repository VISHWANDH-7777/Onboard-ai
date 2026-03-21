from __future__ import annotations

from dataclasses import dataclass
from itertools import cycle
from typing import Dict, List, Tuple

import pandas as pd


@dataclass
class RoleRecord:
  role: str
  skills_required: List[str]
  skill_level: List[str]
  category: str


def _build_skill_catalog() -> List[str]:
  foundations = [
    'Python', 'JavaScript', 'TypeScript', 'Java', 'Go', 'Rust', 'C#', 'C++', 'SQL', 'NoSQL',
    'React', 'Vue', 'Angular', 'Node.js', 'Express', 'FastAPI', 'Django', 'Flask',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Kafka', 'RabbitMQ',
    'Docker', 'Kubernetes', 'Terraform', 'AWS', 'Azure', 'GCP',
    'CI/CD', 'Git', 'Linux', 'System Design', 'Microservices', 'GraphQL', 'REST API',
    'NLP', 'Computer Vision', 'MLOps', 'Data Modeling', 'ETL', 'Feature Engineering',
    'Pandas', 'NumPy', 'scikit-learn', 'PyTorch', 'TensorFlow', 'Prompt Engineering',
  ]

  tracks = [
    'Frontend', 'Backend', 'Data', 'Cloud', 'Security', 'DevOps', 'AI', 'Product', 'Mobile',
    'Testing', 'Analytics', 'Architecture', 'Networking', 'SRE',
  ]
  topics = [
    'Fundamentals', 'Design', 'Implementation', 'Optimization', 'Monitoring', 'Automation',
    'Scaling', 'Governance', 'Operations', 'Debugging', 'Integration', 'Best Practices',
  ]

  generated = []
  for track in tracks:
    for topic in topics:
      generated.append(f'{track} {topic}')
      generated.append(f'{track} {topic} Advanced')
      generated.append(f'{track} {topic} Lab')

  # Ensure 500+ unique skills in the custom skill catalog.
  all_skills = list(dict.fromkeys(foundations + generated))
  while len(all_skills) < 560:
    idx = len(all_skills) + 1
    all_skills.append(f'Adaptive Skill {idx}')

  return all_skills


def _build_roles_by_category() -> Dict[str, List[str]]:
  return {
    'Software Development': [
      'Full Stack Developer', 'Backend Developer', 'Frontend Developer', 'API Developer',
      'Microservices Engineer', 'Web Platform Engineer', 'Dev Productivity Engineer',
      'UI Engineer', 'Integration Engineer', 'Application Engineer',
    ],
    'Data & AI': [
      'Data Scientist', 'Machine Learning Engineer', 'NLP Engineer', 'AI Research Engineer',
      'MLOps Engineer', 'Data Engineer', 'Applied Scientist', 'Analytics Engineer',
      'Prompt Engineer', 'AI Quality Engineer',
    ],
    'Cloud & DevOps': [
      'DevOps Engineer', 'Cloud Engineer', 'Site Reliability Engineer', 'Platform Engineer',
      'Infrastructure Engineer', 'Kubernetes Engineer', 'Release Engineer',
      'Observability Engineer', 'Build Engineer', 'Cloud Security Engineer',
    ],
    'Security': [
      'Security Engineer', 'Application Security Engineer', 'Cloud Security Analyst',
      'Threat Detection Engineer', 'IAM Engineer', 'SOC Analyst',
      'Security Automation Engineer', 'Incident Response Engineer',
      'Risk & Compliance Engineer', 'Penetration Tester',
    ],
    'Product & Strategy': [
      'Product Manager', 'Technical Product Manager', 'Growth Product Manager',
      'Data Product Manager', 'AI Product Manager', 'Business Analyst',
      'Technology Strategist', 'Solution Consultant', 'Program Manager', 'Innovation Manager',
    ],
    'Mobile Development': [
      'Android Developer', 'iOS Developer', 'React Native Developer', 'Flutter Developer',
      'Mobile QA Engineer', 'Mobile Platform Engineer', 'Mobile Security Engineer',
      'Mobile Performance Engineer', 'Mobile DevOps Engineer', 'Cross-Platform Engineer',
    ],
    'QA & Testing': [
      'QA Engineer', 'Automation Test Engineer', 'Performance Test Engineer',
      'SDET', 'Quality Analyst', 'Test Architect', 'Reliability Test Engineer',
      'API Test Engineer', 'Security Test Engineer', 'Mobile Test Engineer',
    ],
    'Architecture': [
      'Software Architect', 'Solution Architect', 'Enterprise Architect',
      'Cloud Architect', 'Data Architect', 'AI Architect', 'Integration Architect',
      'Security Architect', 'Platform Architect', 'Systems Architect',
    ],
    'Networking': [
      'Network Engineer', 'Network Automation Engineer', 'Cloud Network Engineer',
      'Network Security Engineer', 'SDN Engineer', 'Wireless Engineer',
      'Infrastructure Network Engineer', 'NOC Engineer', 'Edge Network Engineer',
      'Connectivity Engineer',
    ],
    'Business Systems': [
      'CRM Developer', 'ERP Engineer', 'Business Systems Analyst',
      'Salesforce Developer', 'Dynamics Engineer', 'SAP Consultant',
      'Workflow Automation Engineer', 'Process Optimization Analyst',
      'Enterprise Integrations Specialist', 'Operations Systems Engineer',
    ],
    'Design & UX': [
      'UX Designer', 'Product Designer', 'UX Researcher', 'Design Technologist',
      'Interaction Designer', 'Design Systems Engineer', 'Accessibility Specialist',
      'Visual Designer', 'Service Designer', 'Experience Strategist',
    ],
    'Leadership': [
      'Engineering Manager', 'Data Science Manager', 'Director of Engineering',
      'Head of Platform', 'AI Program Lead', 'Technical Lead', 'Principal Engineer',
      'Architecture Lead', 'Delivery Manager', 'R&D Lead',
    ],
  }


def build_custom_dataset() -> Tuple[pd.DataFrame, Dict[str, List[str]], List[Tuple[str, str]]]:
  skill_catalog = _build_skill_catalog()
  roles_by_category = _build_roles_by_category()

  records: List[RoleRecord] = []
  relationships: List[Tuple[str, str]] = []

  skill_iter = cycle(skill_catalog)
  for category, roles in roles_by_category.items():
    for role in roles:
      skills = [next(skill_iter) for _ in range(6)]
      records.append(
        RoleRecord(
          role=role,
          skills_required=skills,
          skill_level=['Intermediate'],
          category=category,
        ),
      )

      for left, right in zip(skills, skills[1:]):
        relationships.append((left, right))

  data = pd.DataFrame(
    [
      {
        'role': rec.role,
        'skills_required': rec.skills_required,
        'skill_level': rec.skill_level,
        'category': rec.category,
      }
      for rec in records
    ],
  )

  return data, {'skills': skill_catalog}, relationships
