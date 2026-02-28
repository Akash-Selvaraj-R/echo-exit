"use client";

import React from "react";

const PARTICLE_COUNT = 24;

export const ParticleField: React.FC = () => {
    const particles = React.useMemo(() => {
        return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            size: 2 + Math.random() * 3,
            duration: 15 + Math.random() * 20,
            delay: Math.random() * 15,
            opacity: 0.2 + Math.random() * 0.4,
        }));
    }, []);

    return (
        <div className="particle-field">
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="particle"
                    style={{
                        left: p.left,
                        bottom: "-10px",
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        opacity: p.opacity,
                        animationDuration: `${p.duration}s`,
                        animationDelay: `${p.delay}s`,
                    }}
                />
            ))}
        </div>
    );
};
