package com.katameszaros.poller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by kata on 2017.08.20..
 */

@Controller
public class PollController {

    @RequestMapping({"/voter/**"})
    public String poll(Model model){
        model.addAttribute("","");
        return "poll";
    };
}
