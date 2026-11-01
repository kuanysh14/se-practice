import unittest
from booking import can_book


class BookingTests(unittest.TestCase):
    # --- the six table cases ---------------------------------------------

    def test_touching_end_is_allowed(self):
        result = can_book(660, 720, 540, False, [(600, 660)])
        self.assertIs(result, True)

    def test_overlap_is_rejected(self):
        result = can_book(630, 690, 540, False, [(600, 660)])
        self.assertIs(result, False)

    def test_blocked_room_is_rejected(self):
        result = can_book(660, 720, 540, True, [(600, 660)])
        self.assertIs(result, False)

    def test_exactly_two_hours_is_allowed(self):
        result = can_book(720, 840, 540, False, [(600, 660)])
        self.assertIs(result, True)

    def test_over_two_hours_is_rejected(self):
        result = can_book(720, 841, 540, False, [(600, 660)])
        self.assertIs(result, False)

    def test_starting_now_is_rejected(self):
        result = can_book(540, 570, 540, False, [(600, 660)])
        self.assertIs(result, False)

    # --- AC1: range, day bounds, zero-length/reversed ----------------------
    # Each case below satisfies AC2-AC4 on its own, so only AC1 can explain a False.

    def test_zero_length_is_rejected(self):
        result = can_book(700, 700, 540, False, [(600, 660)])
        self.assertIs(result, False)

    def test_reversed_interval_is_rejected(self):
        result = can_book(720, 700, 540, False, [(600, 660)])
        self.assertIs(result, False)

    def test_negative_start_is_rejected(self):
        result = can_book(-30, 30, 540, False, [(600, 660)])
        self.assertIs(result, False)

    def test_end_exactly_at_midnight_is_allowed(self):
        result = can_book(1380, 1440, 540, False, [(600, 660)])
        self.assertIs(result, True)

    def test_end_past_midnight_is_rejected(self):
        result = can_book(1380, 1441, 540, False, [(600, 660)])
        self.assertIs(result, False)

    def test_start_one_minute_after_now_is_allowed(self):
        result = can_book(541, 571, 540, False, [(600, 660)])
        self.assertIs(result, True)

    # --- AC2: duration -------------------------------------------------
    # Range, now and overlap are all fine here, so only AC2 can explain a False.

    def test_one_minute_booking_is_allowed(self):
        result = can_book(720, 721, 540, False, [(600, 660)])
        self.assertIs(result, True)

    # --- AC3: blocked ----------------------------------------------------
    # Otherwise fully valid, and no existing bookings at all in the second case,
    # so only AC3 can explain a False.

    def test_blocked_with_no_existing_bookings(self):
        result = can_book(660, 720, 540, True, [])
        self.assertIs(result, False)

    # --- AC4: every overlap relationship, and every entry is checked -----

    def test_overlap_on_the_start_side_is_rejected(self):
        result = can_book(570, 630, 540, False, [(600, 660)])
        self.assertIs(result, False)

    def test_request_inside_existing_booking_is_rejected(self):
        result = can_book(615, 645, 540, False, [(600, 660)])
        self.assertIs(result, False)

    def test_request_containing_existing_booking_is_rejected(self):
        # duration is exactly 120, so AC2 cannot be the cause of a False here
        result = can_book(570, 690, 540, False, [(600, 660)])
        self.assertIs(result, False)

    def test_identical_interval_is_rejected(self):
        result = can_book(600, 660, 540, False, [(600, 660)])
        self.assertIs(result, False)

    def test_touching_start_is_allowed(self):
        result = can_book(570, 600, 540, False, [(600, 660)])
        self.assertIs(result, True)

    def test_fits_exactly_between_two_existing(self):
        result = can_book(660, 720, 540, False, [(600, 660), (720, 780)])
        self.assertIs(result, True)

    def test_conflicts_with_the_second_of_two_existing(self):
        # only the second entry conflicts - catches a check that stops after the first
        result = can_book(720, 780, 540, False, [(600, 660), (700, 760)])
        self.assertIs(result, False)

    def test_conflict_found_in_an_unsorted_list(self):
        result = can_book(610, 650, 540, False, [(900, 960), (600, 660)])
        self.assertIs(result, False)

    def test_empty_existing_list_is_allowed(self):
        result = can_book(600, 660, 540, False, [])
        self.assertIs(result, True)

    def test_free_slot_among_three_existing(self):
        result = can_book(760, 800, 540, False, [(600, 660), (700, 760), (800, 860)])
        self.assertIs(result, True)

    # --- extra edge case added after v1 passed everything else -----------
    # now=0 is the earliest possible "now"; start must still be strictly after it.

    def test_start_at_midnight_with_now_at_midnight_is_rejected(self):
        result = can_book(0, 60, 0, False, [(600, 660)])
        self.assertIs(result, False)

    def test_start_one_minute_after_midnight_with_now_at_midnight(self):
        result = can_book(1, 61, 0, False, [(600, 660)])
        self.assertIs(result, True)

    # --- AC5: a real Boolean, and existing is never modified --------------

    def test_result_is_a_real_boolean_on_success(self):
        result = can_book(660, 720, 540, False, [(600, 660)])
        self.assertIsInstance(result, bool)

    def test_result_is_a_real_boolean_on_rejection(self):
        result = can_book(630, 690, 540, False, [(600, 660)])
        self.assertIsInstance(result, bool)

    def test_existing_is_unchanged_after_an_accepted_request(self):
        existing = [(900, 960), (600, 660), (700, 760)]
        before = list(existing)
        can_book(780, 840, 540, False, existing)
        self.assertEqual(existing, before)

    def test_existing_is_unchanged_after_a_rejected_request(self):
        existing = [(900, 960), (600, 660), (700, 760)]
        before = list(existing)
        can_book(610, 650, 540, False, existing)
        self.assertEqual(existing, before)


if __name__ == "__main__":
    unittest.main()