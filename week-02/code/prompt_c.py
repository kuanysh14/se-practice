import unittest


def _is_number(value):
    return isinstance(value, (int, float)) and not isinstance(value, bool)


def analyze_marks(marks, pass_mark=50):
    """Return average, highest, lowest and pass_rate (%) for a list of marks."""
    if not _is_number(pass_mark) or not 0 <= pass_mark <= 100:
        raise ValueError("pass_mark must be a number between 0 and 100.")

    try:
        marks = list(marks)
    except TypeError:
        raise ValueError("marks must be a list of numbers.")

    if not marks:
        raise ValueError("marks must not be empty.")

    for mark in marks:
        if not _is_number(mark):
            raise ValueError(f"Non-numeric mark: {mark!r}")
        if not 0 <= mark <= 100:  # also rejects NaN
            raise ValueError(f"Mark out of range (0-100): {mark!r}")

    passed = sum(1 for mark in marks if mark >= pass_mark)

    return {
        "average": round(sum(marks) / len(marks), 2),
        "highest": max(marks),
        "lowest": min(marks),
        "pass_rate": round(passed / len(marks) * 100, 2),
    }


class TestAnalyzeMarks(unittest.TestCase):
    def test_example(self):
        self.assertEqual(
            analyze_marks([40, 60, 80], 50),
            {"average": 60, "highest": 80, "lowest": 40, "pass_rate": 66.67},
        )

    def test_one_mark(self):
        self.assertEqual(
            analyze_marks([75]),
            {"average": 75, "highest": 75, "lowest": 75, "pass_rate": 100.0},
        )

    def test_decimals(self):
        self.assertEqual(
            analyze_marks([49.5, 50.5, 75.25]),
            {"average": 58.42, "highest": 75.25, "lowest": 49.5, "pass_rate": 66.67},
        )

    def test_custom_pass_mark(self):
        self.assertEqual(analyze_marks([40, 60, 80], pass_mark=70)["pass_rate"], 33.33)

    def test_pass_mark_is_inclusive(self):
        self.assertEqual(analyze_marks([50], pass_mark=50)["pass_rate"], 100.0)

    def test_empty_list(self):
        with self.assertRaises(ValueError):
            analyze_marks([])

    def test_text_value(self):
        with self.assertRaises(ValueError):
            analyze_marks([50, "abc"])
        with self.assertRaises(ValueError):
            analyze_marks([50, "70"])

    def test_below_zero(self):
        with self.assertRaises(ValueError):
            analyze_marks([50, -1])

    def test_above_hundred(self):
        with self.assertRaises(ValueError):
            analyze_marks([50, 100.5])


if __name__ == "__main__":
    unittest.main()