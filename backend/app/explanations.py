
def generate_explanation(activity: dict, prediction: dict) -> dict:
    """
    Generate a caregiver-friendly explanation using local rules.
    This does not use an LLM or make medical conclusions.
    """

    observations = []

    total_events = activity.get("total_events", 0)
    unique_sensors = activity.get("unique_sensors", 0)
    night_events = activity.get("night_events", 0)
    active_hours = activity.get("active_hours", 0)
    events_per_active_hour = activity.get("events_per_active_hour", 0)

    observations.append(
        f"{total_events} activity events were recorded."
    )
    observations.append(
        f"{unique_sensors} unique sensors were active."
    )

    if night_events > 0:
        observations.append(
            f"{night_events} events were recorded during the dataset's "
            "night-time period."
        )

    if active_hours == 0:
        observations.append(
            "No active hours were recorded for this observation."
        )
    else:
        observations.append(
            f"Recorded activity spans {active_hours} active hours."
        )

    observations.append(
        f"Recorded activity rate: {events_per_active_hour:.2f} "
        "events per active hour."
    )

    is_anomaly = bool(prediction.get("is_anomaly", False))

    if is_anomaly:
        explanation = (
            "The activity-pattern model flagged this observation as "
            "unusual compared with patterns learned during training. "
            "The flag alone does not identify the cause."
        )
        suggested_action = (
            "Review the recorded activity and recent context. "
            "If appropriate, check in with the resident."
        )
    else:
        explanation = (
            "The activity-pattern model did not flag this observation "
            "as unusual. This does not guarantee that everything is normal."
        )
        suggested_action = (
            "Continue routine monitoring and review changes in context."
        )

    return {
        "explanation": explanation,
        "observations": observations,
        "suggested_action": suggested_action,
        "generator": "local_rules",
        "disclaimer": (
            "Experimental activity-pattern support only. "
            "Not a medical diagnosis or guaranteed emergency detection."
        ),
    }
