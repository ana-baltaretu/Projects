package org.firstinspires.ftc.robotcontroller.internal;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

import com.qualcomm.ftcrobotcontroller.R;

public class ItemAdapter extends BaseAdapter {

    LayoutInflater mInflater;
    String[] items;
    String[] prices;
    String[] descriptions;

    public ItemAdapter(Context c, String[] i, String[] p, String[] d){
        items = i;
        prices = p;
        descriptions = d;
        mInflater = (LayoutInflater)c.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
    }

    @Override
    public int getCount(){
        return items.length;
    }

    @Override
    public Object getItem(int i){
        return items[i];
    }

    @Override
    public long getItemId(int i) {
        return i;
    }

    @Override
    public View getView(int i, View view, ViewGroup viewGroup){

        View v = mInflater.inflate(R.layout.my_list_view_detail, null);
        TextView nameTextView = (TextView)v.findViewById(R.id.nameTextView);
        TextView description = (TextView)v.findViewById(R.id.description);
        TextView PriceTextView = (TextView)v.findViewById(R.id.PriceTextView);

        String name = items[i];
        String desc = descriptions[i];
        String cost = prices[i];

        nameTextView.setText(name);
        description.setText(desc);
        PriceTextView.setText(cost);


        return v;
    }


}
