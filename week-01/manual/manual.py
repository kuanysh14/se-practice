def is_valid_mark(value):
    if isinstance(value, bool):
        return False
    try:
        val=float(value)
        return 0<=val<=100
    except (ValueError, TypeError):
        return False

def print_mark_stats(marks):
    valid_marks = []
    for mark in marks:
        if is_valid_mark(mark):
            valid_marks.append(mark)
    if len(valid_marks) == 0:
        print("No valid marks were given")
        return

    total = sum(valid_marks)
    average = total/len(valid_marks)
    highest = max(valid_marks)
    lowest = min(valid_marks)

    passed = 0
    for mark in valid_marks:
        if mark>=50:
            passed+=1
    pass_rate=passed/len(valid_marks)*100

    print("number of valid marks:", len(valid_marks))
    print(f"Average: {average:.2f}")
    print("highest:", highest)
    print("lowest:", lowest)
    print(f"pass rate: {pass_rate:.1f}%")

test_cases = {
    "A": [85,23,45,90,92],
    "B": [88,47,-5,101,"abc",73,50,"",100],
    "C": [10,20,30],
    "D": ["abc","","xyz"],
}

for name, marks in test_cases.items():
    print(f"case {name}")
    print_mark_stats(marks)
    print()