-- 1. Upcoming Events Registered by Local Users
-- Display users who have registered for upcoming events conducted in their own city.

SELECT
    usr.full_name,
    evt.title,
    evt.start_date,
    usr.city
FROM Users usr
JOIN Registrations reg
    ON usr.user_id = reg.user_id
JOIN Events evt
    ON evt.event_id = reg.event_id
WHERE evt.status = 'upcoming'
  AND usr.city = evt.city
ORDER BY evt.start_date;


-- 2. Highest Rated Events
-- Calculate average ratings for events having at least 10 feedback entries.

SELECT
    evt.title,
    ROUND(AVG(fb.rating), 2) AS avg_rating
FROM Events evt
JOIN Feedback fb
    ON evt.event_id = fb.event_id
GROUP BY evt.event_id, evt.title
HAVING COUNT(*) >= 10
ORDER BY avg_rating DESC;


-- 3. Users with No Recent Registrations
-- Find users who have not registered for any event during the last 90 days.

SELECT *
FROM Users usr
WHERE NOT EXISTS (
    SELECT 1
    FROM Registrations reg
    WHERE reg.user_id = usr.user_id
      AND reg.registration_date >= DATE_SUB(CURDATE(), INTERVAL 90 DAY)
);


-- 4. Morning Session Statistics
-- Count sessions scheduled between 10 AM and 12 PM for each event.

SELECT
    event_id,
    COUNT(*) AS morning_session_count
FROM Sessions
WHERE TIME(start_time) >= '10:00:00'
  AND TIME(end_time) <= '12:00:00'
GROUP BY event_id;


-- 5. Cities with Maximum Participation
-- Show the top 5 cities based on unique registered users.

SELECT
    evt.city,
    COUNT(DISTINCT reg.user_id) AS participant_count
FROM Events evt
JOIN Registrations reg
    ON evt.event_id = reg.event_id
GROUP BY evt.city
ORDER BY participant_count DESC
LIMIT 5;


-- 6. Event Resource Overview
-- Display the count of PDFs, images, links and total resources for every event.

SELECT
    event_id,
    SUM(resource_type = 'pdf') AS pdf_count,
    SUM(resource_type = 'image') AS image_count,
    SUM(resource_type = 'link') AS link_count,
    COUNT(*) AS total_resources
FROM Resources
GROUP BY event_id;


-- 7. Low Rated Feedback Records
-- List feedback entries where users have given ratings below 3.

SELECT
    usr.full_name,
    evt.title,
    fb.rating,
    fb.comments
FROM Feedback fb
JOIN Users usr
    ON fb.user_id = usr.user_id
JOIN Events evt
    ON fb.event_id = evt.event_id
WHERE fb.rating < 3;


-- 8. Session Count for Upcoming Events
-- Display all upcoming events along with the number of sessions scheduled.

SELECT
    evt.event_id,
    evt.title,
    COUNT(sess.session_id) AS total_sessions
FROM Events evt
LEFT JOIN Sessions sess
    ON evt.event_id = sess.event_id
WHERE evt.status = 'upcoming'
GROUP BY evt.event_id, evt.title;


-- 9. Organizer Performance Summary
-- Show event count categorized by organizer and event status.

SELECT
    usr.full_name AS organizer_name,
    evt.status,
    COUNT(*) AS total_events
FROM Events evt
JOIN Users usr
    ON evt.organizer_id = usr.user_id
GROUP BY usr.user_id, usr.full_name, evt.status;


-- 10. Events Without Feedback
-- Find events that have registrations but no feedback submissions.

SELECT
    evt.event_id,
    evt.title
FROM Events evt
WHERE EXISTS (
    SELECT 1
    FROM Registrations reg
    WHERE reg.event_id = evt.event_id
)
AND NOT EXISTS (
    SELECT 1
    FROM Feedback fb
    WHERE fb.event_id = evt.event_id
);

-- 11. Recent User Registration Summary
-- Count the number of users who joined during the last 7 days.

SELECT
    registration_date,
    COUNT(*) AS user_count
FROM Users
WHERE registration_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
GROUP BY registration_date
ORDER BY registration_date DESC;


-- 12. Event with the Highest Number of Sessions
-- Identify the event(s) that have the maximum session count.

SELECT
    event_id,
    COUNT(*) AS total_sessions
FROM Sessions
GROUP BY event_id
HAVING COUNT(*) = (
    SELECT MAX(session_total)
    FROM (
        SELECT COUNT(*) AS session_total
        FROM Sessions
        GROUP BY event_id
    ) AS session_stats
);


-- 13. Average Event Rating by City
-- Compute the average feedback rating for events conducted in each city.

SELECT
    evt.city,
    ROUND(AVG(fb.rating), 2) AS average_rating
FROM Events evt
JOIN Feedback fb
    ON evt.event_id = fb.event_id
GROUP BY evt.city;


-- 14. Most Popular Events
-- Display the top 3 events based on registration count.

SELECT
    evt.title,
    COUNT(reg.registration_id) AS registration_count
FROM Events evt
JOIN Registrations reg
    ON evt.event_id = reg.event_id
GROUP BY evt.event_id, evt.title
ORDER BY registration_count DESC
LIMIT 3;


-- 15. Session Scheduling Conflicts
-- Detect overlapping sessions occurring within the same event.

SELECT
    s1.event_id,
    s1.title AS session_one,
    s2.title AS session_two,
    s1.start_time,
    s1.end_time
FROM Sessions s1
JOIN Sessions s2
    ON s1.event_id = s2.event_id
   AND s1.session_id < s2.session_id
WHERE s1.start_time < s2.end_time
  AND s1.end_time > s2.start_time;


-- 16. New Users Without Event Registration
-- Find recently registered users who have not enrolled in any event.

SELECT *
FROM Users usr
WHERE usr.registration_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
AND NOT EXISTS (
    SELECT 1
    FROM Registrations reg
    WHERE reg.user_id = usr.user_id
);


-- 17. Speakers Handling Multiple Sessions
-- List speakers who are assigned to more than one session.

SELECT
    speaker_name,
    COUNT(*) AS session_count
FROM Sessions
GROUP BY speaker_name
HAVING COUNT(*) > 1;


-- 18. Events Missing Resources
-- Display events that do not have any associated resources.

SELECT
    evt.event_id,
    evt.title
FROM Events evt
WHERE NOT EXISTS (
    SELECT 1
    FROM Resources res
    WHERE res.event_id = evt.event_id
);


-- 19. Completed Event Performance Report
-- Show registration count and average rating for completed events.

SELECT
    evt.event_id,
    evt.title,
    COUNT(DISTINCT reg.registration_id) AS total_registrations,
    ROUND(AVG(fb.rating), 2) AS average_rating
FROM Events evt
LEFT JOIN Registrations reg
    ON evt.event_id = reg.event_id
LEFT JOIN Feedback fb
    ON evt.event_id = fb.event_id
WHERE evt.status = 'completed'
GROUP BY evt.event_id, evt.title;


-- 20. User Participation Index
-- Calculate event registrations and feedback submissions for each user.

SELECT
    usr.user_id,
    usr.full_name,
    COUNT(DISTINCT reg.event_id) AS events_registered,
    COUNT(DISTINCT fb.feedback_id) AS feedback_count
FROM Users usr
LEFT JOIN Registrations reg
    ON usr.user_id = reg.user_id
LEFT JOIN Feedback fb
    ON usr.user_id = fb.user_id
GROUP BY usr.user_id, usr.full_name;

-- 21. Users Providing the Most Feedback
-- Display the top 5 users based on the number of feedback entries submitted.

SELECT
    usr.full_name,
    COUNT(fb.feedback_id) AS total_feedbacks
FROM Users usr
JOIN Feedback fb
    ON usr.user_id = fb.user_id
GROUP BY usr.user_id, usr.full_name
ORDER BY total_feedbacks DESC
LIMIT 5;


-- 22. Duplicate Event Registrations
-- Identify users who have been registered multiple times for the same event.

SELECT
    user_id,
    event_id,
    COUNT(*) AS registration_count
FROM Registrations
GROUP BY user_id, event_id
HAVING COUNT(*) > 1;


-- 23. Monthly Registration Analysis
-- Display the number of event registrations recorded each month during the last year.

SELECT
    DATE_FORMAT(registration_date, '%Y-%m') AS registration_month,
    COUNT(*) AS total_registrations
FROM Registrations
WHERE registration_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
GROUP BY DATE_FORMAT(registration_date, '%Y-%m')
ORDER BY registration_month;


-- 24. Average Session Length per Event
-- Calculate the average duration of sessions (in minutes) for every event.

SELECT
    event_id,
    ROUND(
        AVG(TIMESTAMPDIFF(MINUTE, start_time, end_time)),
        2
    ) AS avg_session_duration
FROM Sessions
GROUP BY event_id;


-- 25. Events Without Scheduled Sessions
-- Find events that currently do not have any sessions assigned.

SELECT
    evt.event_id,
    evt.title
FROM Events evt
WHERE NOT EXISTS (
    SELECT 1
    FROM Sessions sess
    WHERE sess.event_id = evt.event_id
);