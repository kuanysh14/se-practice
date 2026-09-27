"""Analyze student marks.

Usage:
    python analyze_marks.py                # runs on built-in sample data
    python analyze_marks.py marks.csv      # runs on your CSV

CSV format: one row per student, one column per subject, plus a 'student' column.
    student,Math,Physics,English
    Aigerim,85,78,92
"""

import sys

import pandas as pd

PASS_MARK = 50


def load_marks(path=None):
    if path:
        return pd.read_csv(path).set_index("student")
    return pd.DataFrame(
        {
            "Math": [85, 62, 45, 91, 73, 38, 88, 67],
            "Physics": [78, 58, 52, 89, 70, 41, 84, 60],
            "English": [92, 75, 60, 87, 68, 55, 90, 72],
        },
        index=pd.Index(
            ["Aigerim", "Nurlan", "Dana", "Timur", "Aliya", "Arman", "Madina", "Ruslan"],
            name="student",
        ),
    )


def letter_grade(score):
    for cutoff, grade in [(90, "A"), (80, "B"), (70, "C"), (60, "D"), (PASS_MARK, "E")]:
        if score >= cutoff:
            return grade
    return "F"


def analyze(marks):
    subject_stats = marks.agg(["mean", "median", "std", "min", "max"]).T.round(1)
    subject_stats["pass_rate_%"] = ((marks >= PASS_MARK).mean() * 100).round(1)

    students = pd.DataFrame({"average": marks.mean(axis=1).round(1)})
    students["grade"] = students["average"].apply(letter_grade)
    students["rank"] = students["average"].rank(ascending=False, method="min").astype(int)
    students = students.sort_values("rank")

    return subject_stats, students


def main():
    marks = load_marks(sys.argv[1] if len(sys.argv) > 1 else None)
    subject_stats, students = analyze(marks)

    print("Subject statistics\n", subject_stats, "\n")
    print("Student ranking\n", students, "\n")
    print("Grade distribution\n", students["grade"].value_counts().sort_index(), "\n")
    print("Subject correlation\n", marks.corr().round(2))


if __name__ == "__main__":
    main()