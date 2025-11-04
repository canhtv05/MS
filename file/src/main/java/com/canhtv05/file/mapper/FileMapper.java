package com.canhtv05.file.mapper;

import com.canhtv05.file.dto.res.FileResponse;
import com.canhtv05.file.dto.res.ImageResponse;
import com.canhtv05.file.dto.res.VideoResponse;
import com.canhtv05.file.domain.File;
import com.canhtv05.file.domain.Image;
import com.canhtv05.file.domain.Video;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface FileMapper {

    FileResponse toFileResponse(File file);

    VideoResponse videoToVideoResponse(Video video);

    ImageResponse imageToImageResponse(Image image);
}
