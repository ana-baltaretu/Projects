/* Copyright (c) 2017 FIRST. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted (subject to the limitations in the disclaimer below) provided that
 * the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list
 * of conditions and the following disclaimer.
 *
 * Redistributions in binary form must reproduce the above copyright notice, this
 * list of conditions and the following disclaimer in the documentation and/or
 * other materials provided with the distribution.
 *
 * Neither the name of FIRST nor the names of its contributors may be used to endorse or
 * promote products derived from this software without specific prior written permission.
 *
 * NO EXPRESS OR IMPLIED LICENSES TO ANY PARTY'S PATENT RIGHTS ARE GRANTED BY THIS
 * LICENSE. THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

package org.firstinspires.ftc.robotcontroller.external.samples;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.TextView;

import com.qualcomm.ftcrobotcontroller.R;
import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.eventloop.opmode.Disabled;
import com.qualcomm.robotcore.hardware.DcMotor;
import com.qualcomm.robotcore.hardware.Servo;
import com.qualcomm.robotcore.util.ElapsedTime;
import com.qualcomm.robotcore.util.Range;

import org.firstinspires.ftc.robotcontroller.internal.FtcRobotControllerActivity;

import static org.firstinspires.ftc.robotcontroller.internal.FtcRobotControllerActivity.CLICKED;
import static org.firstinspires.ftc.robotcontroller.internal.FtcRobotControllerActivity.CLICKED2;
import static org.firstinspires.ftc.robotcontroller.internal.FtcRobotControllerActivity.CLICKED3;
import static org.firstinspires.ftc.robotcontroller.internal.FtcRobotControllerActivity.CLICKED4;
import static org.firstinspires.ftc.robotcontroller.internal.FtcRobotControllerActivity.CLICKED5;


/**
 * This file contains an minimal example of a Linear "OpMode". An OpMode is a 'program' that runs in either
 * the autonomous or the teleop period of an FTC match. The names of OpModes appear on the menu
 * of the FTC Driver Station. When an selection is made from the menu, the corresponding OpMode
 * class is instantiated on the Robot Controller and executed.
 *
 * This particular OpMode just executes a basic Tank Drive Teleop for a two wheeled robot
 * It includes all the skeletal structure that all linear OpModes contain.
 *
 * Use Android Studios to Copy this Class, and Paste it into your team's code folder with a new name.
 * Remove or comment out the @Disabled line to add this opmode to the Driver Station OpMode list
 */



@TeleOp(name="Basic: Linear OpMode", group="Linear Opmode")
//@Disabled
public class BasicOpMode_Linear extends LinearOpMode{

    // Declare OpMode members.
    private ElapsedTime runtime = new ElapsedTime();
    private DcMotor leftDrive = null;
    private DcMotor rightDrive = null;
    private Servo servo = null;

    public static int Clicked = 2;

    public static int Clicked1 = 2;
    public static int Clicked2 = 2;
    public static int Clicked3 = 2;
    public static int Clicked4 = 2;
    public static int Clicked5 = 2;

    public static void initter() {
        BasicOpMode_Linear iniMini = new BasicOpMode_Linear();
        iniMini.initialize();
        Log.d("HELLO", "IT's initialized");
    }

    public void initialize()
    {
        Log.d("asa", Boolean.toString(hardwareMap.get(Servo.class, "servo") == null ));
        servo = hardwareMap.get(Servo.class, "servo");
    }

    public static int getButton(){
        runningMain();
        return Clicked1;
    }
    public static int getButton2(){
        runningMain();
        return Clicked2;
    }
    public static int getButton3(){
        runningMain();
        return Clicked3;
    }
    public static int getButton4(){
        runningMain();
        return Clicked4;
    }
    public static int getButton5(){
        runningMain();
        return Clicked5;
    }


    public static void runningMain()
    {
        Clicked1 = FtcRobotControllerActivity.sendButton1();
        Clicked2 = FtcRobotControllerActivity.sendButton2();
        Clicked3 = FtcRobotControllerActivity.sendButton3();
        Clicked4 = FtcRobotControllerActivity.sendButton4();
        Clicked5 = FtcRobotControllerActivity.sendButton5();
        Log.d("Clicked", Integer.toString(CLICKED));

    }

    public static void runner(Context applicationContext) {
        BasicOpMode_Linear aaa = new BasicOpMode_Linear();
        aaa.actuallyThisIsRunning(applicationContext);
    }

    public void actuallyThisIsRunning(Context applicationContext)
    {
        Clicked1 = FtcRobotControllerActivity.sendButton1();
        if (Clicked2 == 1)
        {
           // servo.setPosition(0.2);
        }
        else if (Clicked3 == 1)
        {
           // servo.setPosition(0.4);
        }
        else if (Clicked4 == 1)
        {
           // servo.setPosition(0.6);
        }
        else if (Clicked5 == 1)
        {
           // servo.setPosition(0.8);
        }
        if(Clicked1 == 1) {
            Clicked1 = 0;
            Clicked2 = 0;
            Clicked3 = 0;
            Clicked4 = 0;
            Clicked5 = 0;
        }
        CLICKED2 = Clicked2;
        CLICKED3 = Clicked3;
        CLICKED4 = Clicked4;
        CLICKED5 = Clicked5;
    }

    /**
    public static void running()
    {
        Clicked = FtcRobotControllerActivity.sendButton1();

        if (Clicked == 1)
        {
            Clicked = -1;
        }

    }
    public static int getButton(){
        running();
        return Clicked;
    }

    public static void running2()
    {
        Clicked = FtcRobotControllerActivity.sendButton2();

        if (Clicked == 1)
        {
            Clicked = -1;
        }

    }
    public static int getButton2(){
        running2();
        return Clicked;
    }
    public static void running3()
    {
        Clicked = FtcRobotControllerActivity.sendButton3();

        if (Clicked == 1)
        {
            Clicked = -1;
        }

    }
    public static int getButton3(){
        running3();
        return Clicked;
    }
    public static void running4()
    {
        Clicked = FtcRobotControllerActivity.sendButton4();

        if (Clicked == 1)
        {
            Clicked = -1;
        }

    }

    public static void running5()
    {
        Clicked = FtcRobotControllerActivity.sendButton5();

        if (Clicked == 1)
        {
            Clicked = -1;
        }

    }



     */

    @Override
    public void runOpMode() {
        telemetry.addData("Status", "Initialized");
        telemetry.update();

        // Initialize the hardware variables. Note that the strings used here as parameters
        // to 'get' must correspond to the names assigned during the robot configuration
        // step (using the FTC Robot Controller app on the phone).
        leftDrive  = hardwareMap.get(DcMotor.class, "left_drive");
        rightDrive = hardwareMap.get(DcMotor.class, "right_drive");

        // Most robots need the motor on one side to be reversed to drive forward
        // Reverse the motor that runs backwards when connected directly to the battery
        leftDrive.setDirection(DcMotor.Direction.FORWARD);
        rightDrive.setDirection(DcMotor.Direction.REVERSE);

        // Wait for the game to start (driver presses PLAY)
        waitForStart();
        runtime.reset();

        // run until the end of the match (driver presses STOP)
        while (opModeIsActive()) {

            // Setup a variable for each drive wheel to save power level for telemetry
            double leftPower;
            double rightPower;

            // Choose to drive using either Tank Mode, or POV Mode
            // Comment out the method that's not used.  The default below is POV.

            // POV Mode uses left stick to go forward, and right stick to turn.
            // - This uses basic math to combine motions and is easier to drive straight.
            double drive = -gamepad1.left_stick_y;
            double turn  =  gamepad1.right_stick_x;
            leftPower    = Range.clip(drive + turn, -1.0, 1.0) ;
            rightPower   = Range.clip(drive - turn, -1.0, 1.0) ;

            // Tank Mode uses one stick to control each wheel.
            // - This requires no math, but it is hard to drive forward slowly and keep straight.
            // leftPower  = -gamepad1.left_stick_y ;
            // rightPower = -gamepad1.right_stick_y ;

            // Send calculated power to wheels
            leftDrive.setPower(leftPower);
            rightDrive.setPower(rightPower);

            // Show the elapsed game time and wheel power.
            telemetry.addData("Status", "Run Time: " + runtime.toString());
            telemetry.addData("Motors", "left (%.2f), right (%.2f)", leftPower, rightPower);
            telemetry.update();
        }
    }
}
