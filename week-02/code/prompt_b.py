def analyze_marks(marks, pass_mark=50):
    marks = list(marks)
    if not marks:
        raise ValueError("marks must not be empty")

    for m in marks:
        if isinstance(m, bool) or not isinstance(m, (int, float)):
            raise ValueError(f"non-numeric mark: {m!r}")
        if not 0 <= m <= 100:
            raise ValueError(f"mark out of range (0-100): {m!r}")

    passed = sum(1 for m in marks if m >= pass_mark)
    return {
        "average": sum(marks) / len(marks),
        "highest": max(marks),
        "lowest": min(marks),
        "pass_rate": passed / len(marks) * 100,
    }


# Example
print(analyze_marks([45, 60, 75, 90, 30]))
# {'average': 60.0, 'highest': 90, 'lowest': 30, 'pass_rate': 60.0}