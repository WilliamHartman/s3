update teams
set green_team = $1,
    red_team = $2,
    green_team_two = $3,
    red_team_two = $4
where team_id = 1
returning *