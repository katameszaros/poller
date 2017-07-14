package model;

/**
 * Created by kata on 2017.06.25..
 */
public class Choice {

    String description;
    int quantity;

    public Choice(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer numToRaise) {
        quantity += numToRaise;
    }

}
