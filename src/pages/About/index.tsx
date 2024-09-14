import React, { Fragment } from "react";
import "./index.scss";

const attributionList = [
	{
		name: "Come back later",
		author: "IconScout Store",
		websiteName: "IconScout",
		baseLink: "https://iconscout.com/",
		authorLink: "https://iconscout.com/contributors/iconscout",
		illustrationLink: "https://iconscout.com/illustrations/come-back-later",
	},
	{
		name: "Page Not Found",
		author: "IconScout Store",
		websiteName: "IconScout",
		baseLink: "https://iconscout.com/",
		authorLink: "https://iconscout.com/contributors/iconscout",
		illustrationLink: "https://iconscout.com/illustrations/page-not-found",
	},
];

const About: React.FC = () => {
	return (
		<div className="about">
			<h1>About</h1>
			Flight Dashboard is created by Ahmed Gaafer :D
			<h3>Attributions</h3>
			{attributionList.map((attribution) => (
				<span key={attribution.illustrationLink}>
					<a
						href={attribution.illustrationLink}
						className="text-underline font-size-sm"
						target="_blank"
					>
						{attribution.name}
					</a>{" "}
					by{" "}
					<a
						href={attribution.authorLink}
						className="text-underline font-size-sm"
					>
						{attribution.author}
					</a>{" "}
					on{" "}
					<a
						href={attribution.baseLink}
						className="text-underline font-size-sm"
					>
						{attribution.websiteName}
					</a>
				</span>
			))}
		</div>
	);
};

export default About;
