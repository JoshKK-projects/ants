/*
https://draco18s.github.io/formic-functions/
view
color: a number from 1 to 8
food: 0 or 1
ant: null if there is no ant on that cell, or otherwise an ant object
If a cell contains an ant, the ant object will have the following:

ant
food: 0 or more (maximum 1 for a worker)
type: 1 to 4 for a worker, or 5 for a queen
friend: true or false
*/
var Q_HUNGRY = 2;
var VIEWS = view;
var SELF_SPOT = VIEWS[4];
var TYPE = SELF_SPOT.ant.type;
var ACTION = {};
ACTION.cell = 4;//make sure always outputs something
var FOOD = SELF_SPOT.ant.food;
var SEEN_FOOD = false;
var QUEEN_COLOR = 6;
var NEARBY_ANTS = {};count_ants();//{friend,foe,type[]}

if(TYPE == 5){
	queen_logic();
}

return ACTION;

function queen_logic(){
	if(FOOD < Q_HUNGRY/* and some check to look out for spawned workers */){
		return hungry_queen();
	}
	if((FOOD == 2 && NEARBY_ANTS.type[0] == 0) || (FOOD == 1 && NEARBY_ANTS.type[0] == 1) ){
		for(var i=1;i<9;i+=2){
			if(legal_move(i)){
				ACTION.cell = i;
				ACTION.type = 1
			}
		}
	}
	return ACTION;
}

function hungry_queen(){
	var info = {
		food_index: false,
		trail_index: false,
		set_self_trail: false,
		first_or_lost: true,
		rand_move_index: false
	};

	for(var i=0;i<9;i++){
		//goto food
		if(VIEWS[i].food == 1){
			info.food_index = i;
		}
		if(count_next_to_color(QUEEN_COLOR) > 0 && VIEWS[4].color == QUEEN_COLOR){
			var move_away_index = get_index_of_adjacent_color(QUEEN_COLOR);
			info.trail_index = move_away_index;
		}
		if(count_next_to_color(QUEEN_COLOR) > 0 && VIEWS[4].color != QUEEN_COLOR){
			//set self to queen color
			info.set_self_trail = true;
		}
		if(VIEWS[4].color == QUEEN_COLOR && count_next_to_color(QUEEN_COLOR) == 0){
			//first new segment we should make, move randomly
			info.rand_move_index  = i;
			break;
		}
		else{
			//first turn, or lost, mark ground start trail
			info.set_self_trail = true;
		}
	}
	if(info.food_index!==false){
		try_move(info.food_index);
	}
	else if(info.trail_index!==false){
		try_move(move_away(info.trail_index));
	}
	else if(info.rand_move_index!==false){
		try_move(info.rand_move_index);
	}
	else{
		ACTION.cell = 4;
		ACTION.color = QUEEN_COLOR;
	}


}

function try_move(i){
	if(legal_move(i)){
		ACTION.cell = i;
	}
	else{
		ACTION.cell = 4;
		//just try to move at random
		for(var i = 0;i<9;i++){
			if(legal_move(i)){
				ACTION.cell = i;
			}
		}
	}
}
function legal_move(i){
	if(VIEWS[i].ant){
		return false;
	}
	return true;
}

function check_self(self_spot){
	return SELF_SPOT.ant.type;
}

function get_index_of_adjacent_color(color){
	var index = 4;
	for(var i=0;i<9;i++){
		if(VIEWS[i].color == color && i != 4){
			index = i;
		}
	}
	return index;
}

function count_next_to_color(color){
	var next_to = 0;
	for(var i=0;i<9;i++){
		if(i!=4 && VIEWS[i].color == color){
			next_to++;
		}
	}
	return next_to;
}

function count_ants(){
	var ants = {
		'friend':0,
		'foe':0,
		'type':[0,0,0,0]
	};

	for(var i=0;i<9;i++){
		var ant = VIEWS[i].ant;
		if(ant){
			if(ant.friend){
				ants.friend++;
				ants.type[ant.type+1]++;//BAD SYNTAX it seems FIX
			}
			else{
				ants.foe++;
			}
		}
		if(i==4){
			continue
		}
	}
	console.log(ants);

	NEARBY_ANTS = ants;
}


function move_away(i){
	switch(i){
		case 0:
			return 8;
			break;
		case 1:
			return 7;
			break;
		case 2:
			return 6
			break;
		case 3:
			return 5
			break;
		case 4:
			return 4;
		case 5:
			return 3;
			break;
		case 6:
			return 2;
			break;
		case 7:
			return 1;
			break;
		case 8:
			return 0;
			break;
	}	
	return "this shoudln't happen";
}

function move_to(i){
	return i;
}

function move_90(i){
	switch(i){
		case 0:
			return 6;
			break;
		case 1:
			return 3;
			break;
		case 2:
			return 8
			break;
		case 3:
			return 7
			break;
		case 4:
			return 4;
		case 5:
			return 1;
			break;
		case 6:
			return 0;
			break;
		case 7:
			return 3;
			break;
		case 8:
			return 2;
			break;
	}
}

function move_45(i){
	switch(i){
		case 0:
			return 1;
			break;
		case 1:
			return 2;
			break;
		case 2:
			return 5;
			break;
		case 3:
			return 6
			break;
		case 4:
			return 4;
		case 5:
			return 8;
			break;
		case 6:
			return 3;
			break;
		case 7:
			return 6;
			break;
		case 8:
			return 7;
			break;
	}
}