import { useRef } from "react";

export const useRandom = initialSeed => {
	const seedRef = useRef(initialSeed);
	const initialRef = useRef(initialSeed);

	return [
		() => {
			let seed = seedRef.current; 

      // Robert Jenkins' 32 bit integer hash function.
			seed = seed & 0xffffffff;
			seed = (seed + 0x7ed55d16 + (seed << 12)) & 0xffffffff;
			seed = (seed ^ 0xc761c23c ^ (seed >>> 19)) & 0xffffffff;
			seed = (seed + 0x165667b1 + (seed << 5)) & 0xffffffff;
			seed = ((seed + 0xd3a2646c) ^ (seed << 9)) & 0xffffffff;
			seed = (seed + 0xfd7046c5 + (seed << 3)) & 0xffffffff;
			seed = (seed ^ 0xb55a4f09 ^ (seed >>> 16)) & 0xffffffff;
			seedRef.current = seed;
			return (seed & 0xfffffff) / 0x10000000;
		},
    () => seedRef.current = initialRef.current,
    (newSeed) => {
      seedRef.current = newSeed;
      initialRef.current = newSeed;
    }
	];
};
