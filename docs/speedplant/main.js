/**
 * @typedef {{
 * pos: Vector,
 * item: string,
 * speed: number,
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
 * }} Seed
 */

/**
 * @type {Seed []}
 */
let seeds;

/**
 * @type { number }
 */
let seedSpawnCooldown;

/**
 * @typedef {{
 * pos: Vector,
 * height: number,
 * speed: number,
 * limit: number,
 * }} Plant
 */

/**
 * @type {Plant []}
 */
let plants;

const G = {
	WIDTH: 100,
	HEIGHT: 75,

	PLAYER_RUN_SPEED: 1,

	PLANT_GROW_RATE: 1,

	SEED_SPAWN_RATE: 90,
	SEED_SPEED_MIN: 0.5,
	SEED_SPEED_MAX: 1.0,

	DOOM_TIMER: 100,
	
	// RAIN_DROP_RATE: 1,
	// RAIN_FALL_SPEED: 1,

	// POWERUP_DROP_RATE: 1,

}

title = "SPEED PLANT";

description = `
[Tap] pickup
`;

characters = [
`
  rr  
rrrrrr
  rr  
  rr
rrrrrr
r    r
`,
`
  p  
 ppp 
ppppp
ppppp
 ppp 
`,
];

options = {
	viewSize: {x: G.WIDTH, y: G.HEIGHT},
};

function update() {
	if (!ticks) {		
		// initial plant spawn
		seeds = times(3, ()=>{
			const posX = rnd(0, G.WIDTH);
			return{
				pos:vec(posX,0),
				speed:rnd(G.SEED_SPEED_MIN,G.SEED_SPEED_MAX)
			};
		});

		seedSpawnCooldown = G.SEED_SPAWN_RATE;

		player = {
			pos: vec(G.WIDTH*0.5,G.HEIGHT*0.86),
			item: "",
			speed: G.PLAYER_RUN_SPEED,
		}

		plants = [];
	}

	// draw the player
	color("cyan");
	// box(player.pos, 4);
	char("a", player.pos);
	if(player.item == "seed"){
		color("purple")
		char("b", player.pos.x, player.pos.y - 6);
	}

	// player constant movement
	player.pos.x += player.speed;

	// player position wraparound
	player.pos.wrap(0,G.WIDTH,0,G.HEIGHT);

	// ground
	color("green");
	box(vec(G.WIDTH*0.5,G.HEIGHT*0.97), G.WIDTH, G.HEIGHT * 0.15);

	// spawn timer
	seedSpawnCooldown--;
	if(seedSpawnCooldown <= 0){
		seeds.push({
			pos:vec(rnd(0, G.WIDTH), 0),
			speed:rnd(G.SEED_SPEED_MIN, G.SEED_SPEED_MAX)
		});
		seedSpawnCooldown = G.SEED_SPAWN_RATE;
	}

	// individual plant behavior
	seeds.forEach((seed)=>{
		
		// floor check
		const isCollidingWithFloor = char("b",seed.pos).isColliding.rect.green;
		if(seed.pos.y <= 64){
			seed.pos.y += seed.speed;
		}

		color("purple");
		char("b", seed.pos);
	});

	// handle seed removal
	remove(seeds, (plant)=>{
		const isCollidingWithPlayer = char("b",plant.pos).isColliding.char.a;
		if(isCollidingWithPlayer && input.isJustPressed && player.item != "seed"){
			play("select");
		}
		return((isCollidingWithPlayer && input.isJustPressed && (player.item != "seed")));
	})

	// plant player interaction check
	color("cyan")
	const isCollidingWithPlant = char("a", player.pos).isColliding.char.b;
	if(input.isJustPressed){
		if(isCollidingWithPlant){
			player.item = "seed";
		}
		else if(player.item == "seed"){
			// PLANT SEED IN EMPTY SPOT
			plants.push({
				pos: vec(player.pos.x, 69),
				height: 0,
				speed: G.PLANT_GROW_RATE + (1/difficulty),
				limit: 30,
			})
			player.item = "";
			play("select", {
				pitch: 50,
			});
		}
	}

	plants.forEach((plant)=>{
		// plant.height += plant.speed;
		plant.height += 0.1;
		color("light_red");
		box(plant.pos.x, plant.pos.y - plant.height/2, 5, plant.height);
	})
}
