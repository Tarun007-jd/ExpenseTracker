import { motion } from 'framer-motion';

const AnimatedWave = () => {
    return (
        <div className="fixed bottom-0 left-0 w-full overflow-hidden leading-[0] z-[-1] pointer-events-none">
            <motion.svg
                className="relative block w-[200%] h-[300px] md:h-[400px] lg:h-[500px]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1440 320"
                preserveAspectRatio="none"
                animate={{
                    x: ["0%", "-50%"]
                }}
                transition={{
                    repeat: Infinity,
                    ease: "linear",
                    duration: 15
                }}
            >
                <path
                    fill="var(--color-primary-500)"
                    fillOpacity="0.8"
                    d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                ></path>
                {/* Second duplicated path for seamless loop */}
                <path
                    fill="var(--color-primary-500)"
                    fillOpacity="0.8"
                    transform="translate(1440, 0)"
                    d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                ></path>
            </motion.svg>
            <motion.svg
                className="absolute bottom-0 left-0 block w-[200%] h-[300px] md:h-[400px] lg:h-[500px]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1440 320"
                preserveAspectRatio="none"
                animate={{
                    x: ["-50%", "0%"]
                }}
                transition={{
                    repeat: Infinity,
                    ease: "linear",
                    duration: 20
                }}
            >
                <path
                    fill="var(--color-primary-300)"
                    fillOpacity="0.5"
                    d="M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,197.3C672,224,768,224,864,208C960,192,1056,160,1152,149.3C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                ></path>
                 {/* Second duplicated path for seamless loop */}
                 <path
                    fill="var(--color-primary-300)"
                    fillOpacity="0.5"
                    transform="translate(1440, 0)"
                    d="M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,197.3C672,224,768,224,864,208C960,192,1056,160,1152,149.3C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                ></path>
            </motion.svg>
        </div>
    );
};

export default AnimatedWave;
