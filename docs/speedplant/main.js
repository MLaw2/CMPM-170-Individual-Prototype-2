/**
 * @typedef {{
 * pos: Vector,
 * }} Player
 */

/**
 * @type {Player}
 */
let player;

/**
 * @typedef {{
 * pos: Vector,
 * speed: number,
 * }} Plant
 */

/**
 * @type {Plant []}
 */
let plants;

/**
 * @type { number }
 */
let plantSpawnCooldown;

const G = {
	WIDTH: 480,
	HEIGHT: 75,

	PLAYER_RUN_SPEED: 5,

	PLANT_GROW_RATE: 1,
	PLANT_SPAWN_RATE: 90,
	PLANT_SPEED_MIN: 0.5,
	PLANT_SPEED_MAX: 1.0,
	
	// RAIN_DROP_RATE: 1,
	// RAIN_FALL_SPEED: 1,

	// POWERUP_DROP_RATE: 1,

}

title = "SPEED PLANT";

description = `
Grow as much as you can!
`;

characters = [];

options = {
	viewSize: {x: G.WIDTH, y: G.HEIGHT},
};

function update() {
	if (!ticks) {		
		// initial plant spawn
		plants = times(3, ()=>{
			const posX = rnd(0, G.WIDTH);
			return{
				pos:vec(posX,0),
				speed:rnd(G.PLANT_SPEED_MIN,G.PLANT_SPEED_MAX)
			};
		});

		plantSpawnCooldown = G.PLANT_SPAWN_RATE;

		player = {
			pos: vec(G.WIDTH*0.5,G.HEIGHT*0.9),
		}
	}

	// draw the player
	color("cyan");
	box(player.pos, 4);

	// player constant movement
	player.pos.x += G.PLAYER_RUN_SPEED;

	// player position wraparound
	player.pos.wrap(0,G.WIDTH,0,G.HEIGHT);

	// ground
	color("green");
	box(vec(G.WIDTH*0.5,G.HEIGHT*0.97), G.WIDTH, G.HEIGHT * 0.1);

	// spawn timer
	plantSpawnCooldown--;
	if(plantSpawnCooldown <= 0){
		plants.push({
			pos:vec(rnd(0, G.WIDTH), 0),
			speed:rnd(G.PLANT_SPEED_MIN, G.PLANT_SPEED_MAX)
		});
		plantSpawnCooldown = G.PLANT_SPAWN_RATE;
	}

	// individual plant behavior
	plants.forEach((p)=>{
		
		// floor check
		const isCollidingWithFloor = box(p.pos, 4).isColliding.rect.green;
		if(!isCollidingWithFloor){
			text("YIPEE", 3, 10);
			p.pos.y += p.speed;
		}

		color("purple");
		box(p.pos,4);
	});

}
