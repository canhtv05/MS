package com.leaf.post.dto;

import com.leaf.post.enums.Visibility;
import java.util.List;
import lombok.Data;

@Data
public class PostCreationReq {

    String content;
    List<String> hashtags;
    String fileId;
    Visibility visibility;
}
