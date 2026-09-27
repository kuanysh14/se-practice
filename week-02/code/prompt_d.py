import unittest


def _is_number(x):
    return isinstance(x, (int, float)) and not isinstance(x, bool)


def analyze_marks(marks, pass_mark=50):
    try:
        marks = list(marks)
    except TypeError:
        raise ValueError("marks must be an iterable of numbers") from None

    if not marks:
        raise ValueError("marks must not be empty")

    # x != x is a NaN check that never raises, even for very large ints
    if not _is_number(pass_mark) or pass_mark != pass_mark:
        raise ValueError("pass_mark must be a number")

    for m in marks:
        if not _is_number(m):
            raise ValueError(f"mark is not a number: {m!r}")
        if not 0 <= m <= 100:  # also catches NaN and inf
            raise ValueError(f"mark out of range 0-100: {m!r}")

    passing = sum(1 for m in marks if m >= pass_mark)

    return {
        "average": round(sum(marks) / len(marks), 2),
        "highest": max(marks),
        "lowest": min(marks),
        "pass_rate": round(passing / len(marks) * 100, 2),
    }


class TestAnalyzeMarks(unittest.TestCase):
    def test_example(self):
        self.assertEqual(
            analyze_marks([40, 60, 80], 50),
            {"average": 60.0, "highest": 80, "lowest": 40, "pass_rate": 66.67},
        )

    def test_exact_keys(self):
        result = analyze_marks([70])
        self.assertEqual(set(result), {"average", "highest", "lowest", "pass_rate"})

    def test_one_mark(self):
        self.assertEqual(
            analyze_marks([75]),
            {"average": 75.0, "highest": 75, "lowest": 75, "pass_rate": 100.0},
        )
        self.assertEqual(analyze_marks([30])["pass_rate"], 0.0)

    def test_decimals(self):
        self.assertEqual(
            analyze_marks([70.5, 80.5, 90.0]),
            {"average": 80.33, "highest": 90.0, "lowest": 70.5, "pass_rate": 100.0},
        )

    def test_mark_equal_to_pass_mark_passes(self):
        self.assertEqual(analyze_marks([50])["pass_rate"], 100.0)

    def test_custom_pass_mark(self):
        marks = [40, 60, 80]
        self.assertEqual(analyze_marks(marks, 60)["pass_rate"], 66.67)  # 60 counts
        self.assertEqual(analyze_marks(marks, 70)["pass_rate"], 33.33)
        self.assertEqual(analyze_marks(marks, 81)["pass_rate"], 0.0)

    def test_boundaries_0_and_100_are_valid(self):
        self.assertEqual(
            analyze_marks([0, 100]),
            {"average": 50.0, "highest": 100, "lowest": 0, "pass_rate": 50.0},
        )

    def test_empty_list(self):
        with self.assertRaises(ValueError):
            analyze_marks([])

    def test_text_value(self):
        for bad in (["abc", 50], ["85"], [50, None], [True, 50]):
            with self.subTest(marks=bad):
                with self.assertRaises(ValueError):
                    analyze_marks(bad)

    def test_out_of_range(self):
        for bad in ([-1, 50], [50, 101], [-0.01], [100.01],
                    [float("nan")], [float("inf")]):
            with self.subTest(marks=bad):
                with self.assertRaises(ValueError):
                    analyze_marks(bad)

    def test_non_iterable_and_bad_pass_mark(self):
        with self.assertRaises(ValueError):
            analyze_marks(None)
        with self.assertRaises(ValueError):
            analyze_marks([50], pass_mark="50")


if __name__ == "__main__":
    unittest.main()