package org.firstinspires.ftc.robotcontroller.internal;

import android.app.ActionBar;
import android.app.Activity;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.content.SharedPreferences;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.hardware.usb.UsbDevice;
import android.hardware.usb.UsbManager;
import android.net.wifi.WifiManager;
import android.os.Build;
import android.os.Bundle;
import android.os.IBinder;
import android.preference.PreferenceManager;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.annotation.StringRes;
import android.view.Menu;
import android.view.MenuItem;
import android.view.MotionEvent;
import android.view.View;
import android.webkit.WebView;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.LinearLayout.LayoutParams;
import android.widget.ListView;
import android.widget.PopupMenu;
import android.widget.TextView;

import com.google.blocks.ftcrobotcontroller.BlocksActivity;
import com.google.blocks.ftcrobotcontroller.ProgrammingModeActivity;
import com.google.blocks.ftcrobotcontroller.ProgrammingModeControllerImpl;
import com.google.blocks.ftcrobotcontroller.ProgrammingWebHandlers;
import com.google.blocks.ftcrobotcontroller.runtime.BlocksOpMode;
import com.qualcomm.ftccommon.ClassManagerFactory;
import com.qualcomm.ftccommon.FtcAboutActivity;
import com.qualcomm.ftccommon.FtcEventLoop;
import com.qualcomm.ftccommon.FtcEventLoopIdle;
import com.qualcomm.ftccommon.FtcRobotControllerService;
import com.qualcomm.ftccommon.FtcRobotControllerService.FtcRobotControllerBinder;
import com.qualcomm.ftccommon.FtcRobotControllerSettingsActivity;
import com.qualcomm.ftccommon.LaunchActivityConstantsList;
import com.qualcomm.ftccommon.LaunchActivityConstantsList.RequestCode;
import com.qualcomm.ftccommon.ProgrammingModeController;
import com.qualcomm.ftccommon.Restarter;
import com.qualcomm.ftccommon.UpdateUI;
import com.qualcomm.ftccommon.configuration.EditParameters;
import com.qualcomm.ftccommon.configuration.FtcLoadFileActivity;
import com.qualcomm.ftccommon.configuration.RobotConfigFile;
import com.qualcomm.ftccommon.configuration.RobotConfigFileManager;
import com.qualcomm.ftcrobotcontroller.R;
import com.qualcomm.hardware.HardwareFactory;
import com.qualcomm.robotcore.eventloop.EventLoopManager;
import com.qualcomm.robotcore.eventloop.opmode.FtcRobotControllerServiceState;
import com.qualcomm.robotcore.eventloop.opmode.OpModeRegister;
import com.qualcomm.robotcore.hardware.configuration.LynxConstants;
import com.qualcomm.robotcore.hardware.configuration.Utility;
import com.qualcomm.robotcore.util.Device;
import com.qualcomm.robotcore.util.Dimmer;
import com.qualcomm.robotcore.util.ImmersiveMode;
import com.qualcomm.robotcore.util.RobotLog;
import com.qualcomm.robotcore.wifi.NetworkConnection;
import com.qualcomm.robotcore.wifi.NetworkConnectionFactory;
import com.qualcomm.robotcore.wifi.NetworkType;

import org.firstinspires.ftc.ftccommon.external.SoundPlayingRobotMonitor;
import org.firstinspires.ftc.ftccommon.internal.FtcRobotControllerWatchdogService;
import org.firstinspires.ftc.ftccommon.internal.ProgramAndManageActivity;
import org.firstinspires.ftc.robotcontroller.external.samples.BasicOpMode_Linear;
import org.firstinspires.ftc.robotcore.external.navigation.MotionDetection;
import org.firstinspires.ftc.robotcore.internal.hardware.DragonboardLynxDragonboardIsPresentPin;
import org.firstinspires.ftc.robotcore.internal.network.DeviceNameManager;
import org.firstinspires.ftc.robotcore.internal.network.DeviceNameManagerFactory;
import org.firstinspires.ftc.robotcore.internal.network.WifiDirectDeviceNameManager;
import org.firstinspires.ftc.robotcore.internal.network.PreferenceRemoterRC;
import org.firstinspires.ftc.robotcore.internal.network.StartResult;
import org.firstinspires.ftc.robotcore.internal.network.WifiMuteEvent;
import org.firstinspires.ftc.robotcore.internal.network.WifiMuteStateMachine;
import org.firstinspires.ftc.robotcore.internal.system.AppUtil;
import org.firstinspires.ftc.robotcore.internal.system.Assert;
import org.firstinspires.ftc.robotcore.internal.system.PreferencesHelper;
import org.firstinspires.ftc.robotcore.internal.system.ServiceController;
import org.firstinspires.ftc.robotcore.internal.ui.LocalByRefIntentExtraHolder;
import org.firstinspires.ftc.robotcore.internal.ui.ThemedActivity;
import org.firstinspires.ftc.robotcore.internal.ui.UILocation;
import org.firstinspires.ftc.robotcore.internal.webserver.RobotControllerWebInfo;
import org.firstinspires.ftc.robotcore.internal.webserver.WebServer;
import org.firstinspires.inspection.RcInspectionActivity;

import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;

@SuppressWarnings("WeakerAccess")
public class DoctorActivity extends Activity
{
    public static final String TAG = "RCActivity";
    public String getTag() { return TAG; }

    public static int CLICKED = 0;

    private static final int REQUEST_CONFIG_WIFI_CHANNEL = 1;
    private static final int NUM_GAMEPADS = 2;

    protected WifiManager.WifiLock wifiLock;
    protected RobotConfigFileManager cfgFileMgr;

    protected ProgrammingWebHandlers programmingWebHandlers;
    protected ProgrammingModeController programmingModeController;

    protected UpdateUI.Callback callback;
    protected Context context;
    protected Utility utility;
    protected StartResult prefRemoterStartResult = new StartResult();
    protected StartResult deviceNameStartResult = new StartResult();
    protected PreferencesHelper preferencesHelper;

    protected ImageButton buttonMenu;
    protected TextView textDeviceName;
    protected TextView textNetworkConnectionStatus;
    protected TextView textRobotStatus;
    protected TextView[] textGamepad = new TextView[NUM_GAMEPADS];
    protected TextView textOpMode;
    protected TextView textErrorMessage;
    protected ImmersiveMode immersion;

    protected UpdateUI updateUI;
    protected Dimmer dimmer;
    protected LinearLayout entireScreenLayout;

    protected FtcRobotControllerService controllerService;
    protected NetworkType networkType;

    protected FtcEventLoop eventLoop;
    protected Queue<UsbDevice> receivedUsbAttachmentNotifications;

    protected WifiMuteStateMachine wifiMuteStateMachine;
    protected MotionDetection motionDetection;
    ListView myListView;
    String[] items;
    String[] prices;
    String[] descriptions;

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);

        if (UsbManager.ACTION_USB_DEVICE_ATTACHED.equals(intent.getAction())) {
            UsbDevice usbDevice = intent.getParcelableExtra(UsbManager.EXTRA_DEVICE);
            RobotLog.vv(TAG, "ACTION_USB_DEVICE_ATTACHED: %s", usbDevice.getDeviceName());

            if (usbDevice != null) {  // paranoia
                // We might get attachment notifications before the event loop is set up, so
                // we hold on to them and pass them along only when we're good and ready.
                if (receivedUsbAttachmentNotifications != null) { // *total* paranoia
                    receivedUsbAttachmentNotifications.add(usbDevice);
                    passReceivedUsbAttachmentsToEventLoop();
                }
            }
        }
    }

    protected void passReceivedUsbAttachmentsToEventLoop() {
        if (this.eventLoop != null) {
            for (;;) {
                UsbDevice usbDevice = receivedUsbAttachmentNotifications.poll();
                if (usbDevice == null)
                    break;
                this.eventLoop.onUsbDeviceAttached(usbDevice);
            }
        }
        else {
            // Paranoia: we don't want the pending list to grow without bound when we don't
            // (yet) have an event loop
            while (receivedUsbAttachmentNotifications.size() > 100) {
                receivedUsbAttachmentNotifications.poll();
            }
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        RobotLog.onApplicationStart();  // robustify against onCreate() following onDestroy() but using the same app instance, which apparently does happen
        RobotLog.vv(TAG, "onCreate()");
        ThemedActivity.appAppThemeToActivity(getTag(), this); // do this way instead of inherit to help AppInventor

        // Oddly, sometimes after a crash & restart the root activity will be something unexpected, like from the before crash? We don't yet understand
        RobotLog.vv(TAG, "rootActivity is of class %s", AppUtil.getInstance().getRootActivity().getClass().getSimpleName());
        Assert.assertTrue(FtcRobotControllerWatchdogService.isFtcRobotControllerActivity(AppUtil.getInstance().getRootActivity()));
        Assert.assertTrue(AppUtil.getInstance().isRobotController());

        // Quick check: should we pretend we're not here, and so allow the Lynx to operate as
        // a stand-alone USB-connected module?
        if (LynxConstants.isRevControlHub()) {
            if (LynxConstants.disableDragonboard()) {
                // Double-sure check that the Lynx Module can operate over USB, etc, then get out of Dodge
                RobotLog.vv(TAG, "disabling Dragonboard and exiting robot controller");
                DragonboardLynxDragonboardIsPresentPin.getInstance().setState(false);
                AppUtil.getInstance().finishRootActivityAndExitApp();
            } else {
                // Double-sure check that we can talk to the DB over the serial TTY
                DragonboardLynxDragonboardIsPresentPin.getInstance().setState(true);
            }
        }

        context = this;
        utility = new Utility(this);

        DeviceNameManagerFactory.getInstance().start(deviceNameStartResult);

        PreferenceRemoterRC.getInstance().start(prefRemoterStartResult);

        receivedUsbAttachmentNotifications = new ConcurrentLinkedQueue<UsbDevice>();
        eventLoop = null;

        setContentView(R.layout.activity_doctor);
        myListView = (ListView) findViewById(R.id.myListView);
        Resources res = getResources();
        items = res.getStringArray(R.array.items);
        prices = res.getStringArray(R.array.prices);
        descriptions = res.getStringArray(R.array.descriptions);

        ItemAdapter itemAdapter = new ItemAdapter(this, items, prices, descriptions);
        myListView.setAdapter(itemAdapter);
        myListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
                Intent showDetailActivity = new Intent(getApplicationContext(), DetailActivity.class);
                startActivity(showDetailActivity);
            }
        });


    }
}