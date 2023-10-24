import { createRoot } from "react-dom/client";
import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { CanvasTexture } from "three";

function Letter(props) {
  const defaultMonoFont = "Courier New";
  const font = "'" + props.font + "'" || defaultMonoFont;
  const letter = props.letter;
  const tintColor = props.color || "black";

  if (letter === " " || letter === "") {
    return undefined;
  }

  // create a canvas texture with just the letter and transparent background
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = 256;
  canvas.height = 256;

  context.fillStyle = "rgba(0,0,0,0)";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.font = "200px " + font;
  context.fillStyle = "white";
  context.textAlign = "center";
  context.textBaseline = "middle";
  // bold

  context.fillText(letter, canvas.width / 2, canvas.height / 2);

  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh {...props}>
      <planeGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        map={new CanvasTexture(canvas)}
        transparent={true}
        opacity={0.5}
        color={tintColor}
      />
    </mesh>
  );
}

function TextFragment(props) {
  const font = props.font;
  const letters = props.letters;
  const letterSpacing = props.letterSpacing || 1;
  const tintColor = props.color;

  return (
    <group {...props}>
      {letters.map((letter, index) => (
        <Letter
          position={[index * letterSpacing, 0, 0]}
          letter={letter}
          font={font}
          color={tintColor}
        />
      ))}
    </group>
  );
}

export function Text(props) {
  const font = props.font;
  const maxCharWidth = props.maxCharWidth || 80;
  const letterSpacing = props.letterSpacing || 1;
  const tintColor = props.color;

  // split text into lines
  let components;

  if (typeof props.children === "string") {
    components = [props.children];
  } else {
    components = props.children.map((_) => {
      if (typeof _ === "string") {
        return _;
      } else if (_.type === "br") {
        return "\n";
      } else {
        return "";
      }
    });
  }

  const allText = components.join("");

  const lines = allText.split("\n");

  // lines bound by maxCharWidth
  const constrainedLines: string[] = [];

  lines.forEach((line: string) => {
    const words = line.split(" ");
    let currentLine = "";
    let currentLineWidth = 0;
    words.forEach((word: string) => {
      if (currentLineWidth + word.length > maxCharWidth) {
        constrainedLines.push(currentLine);
        currentLine = "";
        currentLineWidth = 0;
      }
      currentLine += word + " ";
      currentLineWidth += word.length + 1;
    });
    constrainedLines.push(currentLine);
  });

  // split lines into words

  return (
    <group {...props}>
      {constrainedLines.map((line, index) => (
        <TextFragment
          position={[0, -index, 0]}
          letters={line.split("")}
          font={font}
          letterSpacing={letterSpacing}
          color={tintColor}
        />
      ))}
    </group>
  );
}
