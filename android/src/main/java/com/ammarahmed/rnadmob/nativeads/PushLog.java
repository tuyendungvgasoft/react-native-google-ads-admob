package com.ammarahmed.rnadmob.nativeads;

import android.util.Log;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.ZoneId;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.ObjectWriter;

import android.os.Handler;
import android.os.Looper;

import java.io.IOException;

class ItemLog {
    private String url;
    private String time;
    private String params;


    // Constructor, getters and setters
    public ItemLog(String url, String time, String params) {
      this.url = url;
      this.time = time;
      this.params = params;
    }

    public String getURL() {
      return url;
    }

    public void setURL(String url) {
      this.url = url;
    }

    public String getTime() {
      return time;
    }

    public void setTime(String time) {
      this.time = time;
    }

    public String getParams() {
      return params;
    }

    public void setParams(String params) {
      this.params = params;
    }
  }

public class PushLog {

  public static void pushLogDebug(final String name, final String params) {
        // Tạo Handler để chạy trên luồng nền
        Handler handler = new Handler(Looper.getMainLooper());
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                new Thread(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            pushLog(name, params);
                        } catch (Exception e) {
                            Log.e("InfoLog =>", "Error while pushing log to Slack", e);
                        }
                    }
                }).start();
            }
        }, 500); // Trì hoãn 5 giây
    }


  public static  void pushLog(String name, String params) throws Exception {
    
   
    String url = "https://hooks.slack.com/services/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";
    
    LocalDateTime now = LocalDateTime.now(ZoneId.of("UTC+7"));
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss.SSS");
    String formattedTime = now.format(formatter);
  
    ObjectMapper mapper = new ObjectMapper();
  
    ItemLog itemLog = new ItemLog(name, formattedTime, params);
    
    ObjectWriter writer = mapper.writerWithDefaultPrettyPrinter();
    // Chuyển đổi đối tượng thành chuỗi JSON
    String jsonString = mapper.writeValueAsString(itemLog);

    // Tạo payload cho request
    ObjectNode payload = mapper.createObjectNode();
    payload.put("text", jsonString);


    // Thiết lập kết nối HTTP
    URL slackUrl = new URL(url);
    HttpURLConnection conn = (HttpURLConnection) slackUrl.openConnection();
    conn.setDoOutput(true);
    conn.setRequestMethod("POST");
    conn.setRequestProperty("Content-Type", "application/json; utf-8");

    try {
     
      OutputStream os = conn.getOutputStream();
      
      byte[] input = payload.toString().getBytes(StandardCharsets.UTF_8);
      
      os.write(input, 0, input.length);
    } catch (Exception e) {
        Log.e("InfoLog =>", "Error while sending data: ", e);
    }

   
    int responseCode = conn.getResponseCode();
    
  }

}
