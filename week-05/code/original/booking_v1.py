def can_book(start, end, now, blocked, existing):
    """Return True only if the requested slot satisfies AC1-AC4.

    Times are integer minutes after midnight. Intervals include the start
    and exclude the end. `existing` is read but never modified.
    """
    # AC1: valid range, and the slot must start after the current time.
    if not (0 <= start < end <= 1440):
        return False
    if start <= now:
        return False

    # AC2: at most 120 minutes.
    if end - start > 120:
        return False

    # AC3: the room must not be blocked.
    if blocked:
        return False

    # AC4: reject any overlap; touching endpoints are allowed.
    for booked_start, booked_end in existing:
        if start < booked_end and booked_start < end:
            return False

    # AC5: every rule held.
    return True