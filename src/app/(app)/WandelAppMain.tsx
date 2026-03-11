"use client";

import { NoMotionGroupModal } from "@wandelbots/wandelbots-js-react-components";
import { observer } from "mobx-react-lite";
import { env } from "../../runtimeEnv";
import { Jogging } from "../../templates/Jogging/Jogging";
import { useWandelApp } from "../../WandelAppContext";
import { LoadingScreen } from "./LoadingScreen";

export const WandelAppMain = observer(() => {
	const wandelApp = useWandelApp();

	if (!wandelApp.controllers.length) {
		// No robots (virtual or otherwise)! We can't do much without a robot.
		return <NoMotionGroupModal baseUrl={env.WANDELAPI_BASE_URL} />;
	}

	// Everything below this point expects an active robot
	if (!wandelApp.activeRobot) {
		return <LoadingScreen />;
	}

	return (
		<>
			{/* add your code here */}
			<Jogging />
		</>
	);
});
